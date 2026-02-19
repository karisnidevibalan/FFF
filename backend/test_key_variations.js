import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const baseKey = "AIzaSyB7SDJRapWkurg" + "l" + "JUgNBcQdkVdfB" + "l" + "NnKDk";

const variations = [
    baseKey,
    baseKey.replace(/l/g, "I"), // All l to I
    baseKey.replace("lJUg", "IJUg"), // Just first l
    baseKey.replace("BlNn", "BINn"), // Just second l
    baseKey.replace("BlNn", "Blnn"), // second l and first n
    "AIzaSyB7SDJRapWkurgIJUgNBcQdkVdfBINnKDk", // Screenshot variation 1
    "AIzaSyB7SDJRapWkurglJUgNBcQdkVdfBINnKDk", // variation 2
    "AIzaSyB7SDJRapWkurgIJUgNBcQdkVdfBlNnKDk", // variation 3
];

async function testKey(key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            return { success: true, models: data.models.length };
        } else {
            return { success: false, error: data.error?.message || "Unknown error" };
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function run() {
    console.log("Testing variations...");
    for (const key of variations) {
        const result = await testKey(key);
        console.log(`Key: ${key}`);
        if (result.success) {
            console.log(`✅ WORKS! (Found ${result.models} models)`);
        } else {
            console.log(`❌ Fails: ${result.error}`);
        }
    }
}

run();
