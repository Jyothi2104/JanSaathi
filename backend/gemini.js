const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function analyzeComplaint(complaintText, language) {

    const prompt = `
You are JanSaathi, an AI civic complaint assistant.

Analyze this citizen complaint and return ONLY valid JSON.

Complaint:
${complaintText}

Citizen language:
${language}

Classify it into:
- category: water, roads, electricity, health, sanitation, other
- urgency: low, medium, high
- department: appropriate government department
- reply: a short helpful response to the citizen in the same language as the complaint

Return JSON with exactly these fields:
category
urgency
department
reply
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING
                    },
                    urgency: {
                        type: Type.STRING
                    },
                    department: {
                        type: Type.STRING
                    },
                    reply: {
                        type: Type.STRING
                    }
                },
                required: [
                    "category",
                    "urgency",
                    "department",
                    "reply"
                ]
            }
        }
    });

    return JSON.parse(response.text);
}

module.exports = {
    analyzeComplaint
};