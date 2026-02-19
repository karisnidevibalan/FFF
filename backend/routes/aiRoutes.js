import express from 'express';
// import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Gemini Initialization
const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const genAI = new GoogleGenerativeAI(apiKey);

// Helper for generating content with a simpler interface and robust fallback
const generateContent = async (prompt) => {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting Gemini model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`✅ Success with model: ${modelName}`);
      return text;
    } catch (error) {
      lastError = error;
      console.error(`❌ Error with model ${modelName}:`, error.message);

      // If it's an Auth error (400/401/403), don't bother trying other models with same key
      if (error.status === 400 || error.status === 401 || error.status === 403) {
        throw error;
      }
      // If 404, continue to next model
    }
  }

  throw lastError;
};

/* 
// Previous Groq Initialization
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
*/

// Helper to clean JSON from Gemini response
const extractJson = (text) => {
  try {
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    // Attempt to parse to see if it's valid
    return JSON.parse(cleanJson);
  } catch (e) {
    // If direct parse fails, try regex extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw e;
  }
};

// Parse resume text using AI
router.post('/parse-resume', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid resume text',
      });
    }

    const prompt = `You are an expert resume parser. Parse the following resume text and extract information into a structured JSON format.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, just the JSON object.

Resume Text:
"""
${text.substring(0, 10000)}
"""

Extract and return this exact JSON structure:
{
  "fullName": "Full name of the person",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State or full address",
  "linkedin": "LinkedIn URL if present",
  "jobTitle": "Current or target job title",
  "summary": "Professional summary or objective (2-3 sentences)",
  "skills": ["skill1", "skill2", "skill3"],
  "experiences": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date",
      "endDate": "End Date or Present",
      "description": "Job responsibilities and achievements"
    }
  ],
  "educations": [
    {
      "institution": "University/College Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "startDate": "Start Year",
      "endDate": "End Year"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": "Technologies used"
    }
  ],
  "achievements": [
    {
      "title": "Achievement/Certification",
      "description": "Description if any"
    }
  ]
}

Rules:
1. If a field is not found, use empty string "" or empty array []
2. For experiences and educations, extract ALL entries found
3. For skills, list individual skills, not categories
4. Parse dates as found (don't change format)
5. Return ONLY the JSON object, nothing else`;

    const responseText = await generateContent(prompt);
    const parsedData = extractJson(responseText);

    // Ensure all required fields exist
    const finalResult = {
      fullName: parsedData.fullName || '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      location: parsedData.location || '',
      linkedin: parsedData.linkedin || '',
      jobTitle: parsedData.jobTitle || '',
      summary: parsedData.summary || '',
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      experiences: Array.isArray(parsedData.experiences) ? parsedData.experiences.map(exp => ({
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      })) : [],
      educations: Array.isArray(parsedData.educations) ? parsedData.educations.map(edu => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      })) : [],
      projects: Array.isArray(parsedData.projects) ? parsedData.projects.map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
      })) : [],
      achievements: Array.isArray(parsedData.achievements) ? parsedData.achievements.map(ach => ({
        title: ach.title || '',
        description: ach.description || '',
      })) : [],
    };

    res.status(200).json({
      success: true,
      data: finalResult,
    });

  } catch (error) {
    console.error('Gemini Parse Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume with Gemini',
    });
  }
});

// Improve specific content (bullet points, descriptions)
router.post('/improve-content', async (req, res) => {
  try {
    const { text, type, jobTitle } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const prompt = `You are a professional resume writer. Improve the following ${type || 'content'} for a ${jobTitle || 'professional'} resume. 
    Make it more impactful, use strong action verbs, and quantify achievements where possible. 
    Keep the length similar to the original.
    
    ORIGINAL TEXT:
    "${text}"
    
    IMPROVED TEXT (Return ONLY the improved text, no quotes, no explanations):`;

    const resultText = await generateContent(prompt);
    res.status(200).json({
      success: true,
      data: resultText.trim(),
    });
  } catch (error) {
    console.error('Gemini Improve Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate professional summary
router.post('/generate-summary', async (req, res) => {
  try {
    const { experiences, skills, jobTitle } = req.body;

    const prompt = `Generate a compelling professional summary for a ${jobTitle || 'professional'} resume.
    Key Experiences: ${JSON.stringify(experiences)}
    Key Skills: ${skills?.join(', ')}
    
    Rules:
    1. Keep it to 3-4 impactful sentences.
    2. Focus on value proposition and key achievements.
    3. Return ONLY the summary text.`;

    const resultText = await generateContent(prompt);
    res.status(200).json({
      success: true,
      data: resultText.trim(),
    });
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Suggest skills
router.post('/suggest-skills', async (req, res) => {
  try {
    const { jobTitle, existingSkills } = req.body;

    const prompt = `As an expert career coach, suggest 10 relevant hard and soft skills for a ${jobTitle} role.
    Current skills to avoid repeating: ${existingSkills?.join(', ')}
    
    Return ONLY a JSON array of strings:
    ["Skill 1", "Skill 2", ...]`;

    const responseText = await generateContent(prompt);
    const trimmedResponse = responseText.trim();

    let skills = [];
    try {
      const match = trimmedResponse.match(/\[.*\]/s);
      skills = JSON.parse(match ? match[0] : trimmedResponse);
    } catch (e) {
      // Fallback for non-JSON response
      skills = trimmedResponse.split('\n')
        .map(s => s.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .filter(s => s && s.length > 2)
        .slice(0, 10);
    }

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error('Gemini Skills Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
