import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

async function test(version) {
    const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Version: ${version}`);
        if (data.models) {
            console.log(`✅ SUCCESS (${version}): Found ${data.models.length} models`);
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log(`❌ FAIL: ${JSON.stringify(data.error)}`);
        }
    } catch (e) {
        console.log(`❌ ERROR: ${e.message}`);
    }
}

async function run() {
    await test("v1");
    await test("v1beta");
}

run();
