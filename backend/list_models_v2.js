import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

async function listModels() {
    console.log("Using API Key:", apiKey.substring(0, 10) + "...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        console.log("✅ Models found:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.log("No models returned.");
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
}

listModels();
