import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        fs.writeFileSync("found_models.json", JSON.stringify(data.models, null, 2));
        console.log("✅ Models saved to found_models.json");

        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name}`);
            });
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
}

listModels();
