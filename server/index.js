const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { transcribeAudio } = require("./services/speech-to-text");
const { send_data_to_llm } = require("./services/llm-service");
const { getMessages } = require("./services/message");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cors());

app.post("/api/speech", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No audio file received",
            });
        }

        // Transcribe the audio file using Deepgram

        const transcript = await transcribeAudio(req.file.path);
        console.log("Transcript:", transcript);

        // Send the transcript to the LLM service

        const llmResponse = await send_data_to_llm(transcript);
        console.log("LLM Response:", llmResponse);

        // Parse the LLM response to determine the service

        let services = [];
        try {
            const parsedResponse = JSON.parse(llmResponse);
            services = parsedResponse.services || [];
        } catch (error) {
            console.error("Error parsing LLM response:", error);
        }

        res.json({
            success: true,
            text: transcript,
            services: services
        });
        
        for (const service of services) {
            getMessages(service);
        }

    } catch (error) {
        console.error("STT Error:", error);

        res.status(500).json({
            success: false,
            error: "Speech-to-text failed",
        });
    }
});

app.listen(5000, "0.0.0.0", () => {
    console.log("Server is running on port 5000");
});