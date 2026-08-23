const dotenv = require("dotenv");
const fs = require("fs");
const { DeepgramClient } = require("@deepgram/sdk");

dotenv.config();

const deepgram = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

const transcribeAudio = async (audioFilePath) => {
    try {
        const result = await deepgram.listen.v1.media.transcribeFile(
            fs.createReadStream(audioFilePath),
            {
                model: "nova-3",
                smart_format: true,
            }
        );

        return result.results.channels[0].alternatives[0].transcript;

    } finally {
        // Always delete temporary audio file
        if (fs.existsSync(audioFilePath)) {
            fs.unlinkSync(audioFilePath);
        }
    }
};

module.exports = { transcribeAudio };