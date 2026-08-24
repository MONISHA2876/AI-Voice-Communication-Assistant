const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const send_data_to_llm = async () =>{
    try{
        const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: "Explain how AI works in a few words",
        });

        return interaction.output_text;
    }catch(error){
        console.error("LLM Error:", error);
        throw error;
    }
}

module.exports = { send_data_to_llm };