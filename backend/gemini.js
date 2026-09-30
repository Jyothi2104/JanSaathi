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

    let responseText = null;
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

    for (const modelName of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING },
                            urgency: { type: Type.STRING },
                            department: { type: Type.STRING },
                            reply: { type: Type.STRING }
                        },
                        required: ["category", "urgency", "department", "reply"]
                    }
                }
            });
            responseText = response.text;
            if (responseText) break;
        } catch (err) {
            console.warn(`Model ${modelName} failed, trying next...`, err.message);
        }
    }

    if (!responseText) {
        // Fallback response if AI model service is temporarily down
        return {
            category: "other",
            urgency: "medium",
            department: "Municipal Civic Desk",
            reply: "Your complaint has been logged successfully and routed to the municipal officer for review."
        };
    }

    return JSON.parse(responseText);
}

module.exports = {
    analyzeComplaint
};