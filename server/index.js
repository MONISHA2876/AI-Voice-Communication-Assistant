const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { transcribeAudio } = require("./services/speech-to-text");
const {
    send_data_to_llm,
    get_response_from_llm
} = require("./services/llm-service");
const { getMessages } = require("./services/message");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cors());

app.post("/api/speech", upload.single("file"), async (req, res) => {
    try {
        // STEP 1: Audio -> Transcript
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No audio file received",
            });
        }

        const transcript = await transcribeAudio(req.file.path);
        console.log("Transcript:", transcript);

        // STEP 2: Transcript -> Router LLM
        const llmResponse = await send_data_to_llm(transcript);
        console.log("LLM Response:", llmResponse);

        // STEP 3: Parse router response
        const parsedResponse =
            typeof llmResponse === "string"
                ? JSON.parse(llmResponse)
                : llmResponse;

        if (!parsedResponse.supported) {
            return res.json({
                success: true,
                text: transcript,
                response:
                    "I can help you read WhatsApp messages, SMS messages, and emails, but this request is outside my supported capabilities.",
                services: [],
                messages: {},
            });
        }

        const services = parsedResponse.services || [];
        const messagesByService = {};

        // STEP 4: Fetch each service SEQUENTIALLY
        for (const service of services) {
            console.log(`Fetching ${service} messages...`);

            const messages = await getMessages(service);

            messagesByService[service] = messages;

            console.log(`${service} messages:`, messages);
        }

        // STEP 5: Get the natural-language response
        console.log(messagesByService);
        const finalResponse = await get_response_from_llm({
            userRequest: transcript,
            routerResponse: parsedResponse,
            messages: messagesByService,
        });

        console.log("Final LLM Response:", finalResponse);

        // STEP 6: Respond only after all steps finish
        return res.json({
            success: true,
            text: transcript,
            services,
            messages: messagesByService,
            response: finalResponse,
        });

    } catch (error) {
        console.error("Pipeline Error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                error: "Pipeline failed",
            });
        }
    }
});

app.listen(5000, "0.0.0.0", () => {
    console.log("Server is running on port 5000");
});