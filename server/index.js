const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const dotenv = require("dotenv");
const { DeepgramClient } = require("@deepgram/sdk");

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

const deepgram = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

app.use(express.json());
app.use(cors());

app.post("/api/speech", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No audio file received",
            });
        }

        console.log("Audio received:", req.file.originalname);

        const result = await deepgram.listen.v1.media.transcribeFile(
            fs.createReadStream(req.file.path),
            {
                model: "nova-3",
                smart_format: true,
            }
        );

        const transcript =
            result.results.channels[0].alternatives[0].transcript;

        console.log("Transcript:", transcript);

        // Delete temporary audio file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            text: transcript,
        });

    } catch (error) {
        console.error("STT Error:", error);

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: "Speech-to-text failed",
        });
    }
});

app.listen(5000, "0.0.0.0", () => {
    console.log("Server is running on port 5000");
});