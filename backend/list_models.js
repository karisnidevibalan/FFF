import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

async function listModels() {
    try {
        // Note: The SDK doesn't have a direct listModels method on the main class
        // We usually have to use the fetch API or a specific client, 
        // but we can try to hit an endpoint or just test common names.
        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro"
        ];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent("test");
                console.log(`✅ Model found: ${modelName}`);
            } catch (e) {
                console.log(`❌ Model not found/supported: ${modelName} - ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
