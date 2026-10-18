const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const send_data_to_llm = async (userRequest) =>{
    try{

        const prompt = `
            You are a service router for a personal communication assistant.

            Available services:
            - whatsapp: read WhatsApp messages
            - sms: read SMS messages
            - email: read emails

            Determine which services the user is requesting.

            Return ONLY valid JSON:

            {
            "supported": true,
            "services": ["whatsapp", "sms"]
            }

            If none of the requested services are available:

            {
            "supported": false,
            "services": []
            }

            User request: "${userRequest}"
            `;

        const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: prompt,
        });

        return interaction.output_text;
    }catch(error){
        console.error("LLM Error:", error);
        throw error;
    }
}

const get_response_from_llm = async ({userRequest, routerResponse, messages}) =>{
    try{
        prompt = `
            You are Chintu, a friendly personal communication assistant.

            User request: ${userRequest}
            Router response: ${JSON.stringify(routerResponse)}
            Retrieved messages: ${JSON.stringify(messages)}

            Reply naturally like a helpful friend having a conversation. Use the retrieved messages to answer directly. Avoid robotic lists, headings, timestamps, and unnecessary details unless requested. If multiple messages exist, summarize them conversationally. If no messages exist, say so politely. If unsupported, explain your capabilities briefly. Never invent information.

            Return only the user-facing response in a natural, concise, conversational tone.
        `

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash-lite",
            input: prompt,
        });

        return interaction.output_text;
    }catch(error){
        console.error("LLM Error:", error);
        throw error;
    }
}

module.exports = { send_data_to_llm, get_response_from_llm };