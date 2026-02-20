import express from 'express';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { protect } from '../middleware/auth.js';
import { checkUsageLimit, trackUsage } from '../middleware/usageMiddleware.js';

dotenv.config();

const router = express.Router();
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Text Extraction Endpoint
router.post('/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[Extract] Received file: ${req.file.originalname}, Size: ${req.file.size}, Mimetype: ${req.file.mimetype}`);

    let text = '';
    const buffer = req.file.buffer;

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (req.file.mimetype === 'text/plain') {
      text = buffer.toString('utf-8');
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Basic text extraction for DOCX (fallback)
      // Ideally use mammoth in future, but this matches validation logic
      const content = buffer.toString('utf-8');
      const matches = content.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (matches) {
        text = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    console.log(`[Extract] Extracted text length: ${text.length}`);
    if (text.length > 0) console.log(`[Extract] Sample: ${text.substring(0, 100)}...`);

    if (!text || text.length < 50) {
      return res.status(400).json({ error: 'Could not extract sufficient text. Please try a TXT file.' });
    }

    res.json({ text });
  } catch (error) {
    console.error('Text extraction error:', error);
    res.status(500).json({ error: 'Failed to extract text from file' });
  }
});

// Initialize Groq
const groqKey = (process.env.GROQ_API_KEY || '').trim();
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

// Initialize Gemini
const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// Helper for generating content with a simpler interface and robust fallback
const generateContent = async (prompt, userId) => {
  let text = '';
  let success = false;

  // 1. Try Groq first with model rotation
  if (groq) {
    const modelsToTry = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768"
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting Groq model: ${modelName}...`);
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: modelName,
          temperature: 0.1,
        });
        text = completion.choices[0]?.message?.content;
        if (text) {
          console.log(`✅ Success with Groq: ${modelName}`);
          success = true;
          break;
        }
      } catch (error) {
        console.error(`❌ Groq Error (${modelName}):`, error.message);
        if (error.status === 401 || error.status === 403) break; // Don't rotate if auth fails
      }
    }
  }

  // 2. Try Gemini fallback
  if (!success && genAI) {
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting Gemini fallback: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        console.log(`✅ Success with Gemini: ${modelName}`);
        success = true;
        break;
      } catch (error) {
        console.error(`❌ Gemini Error (${modelName}):`, error.message);
      }
    }
  }

  if (success) {
    if (userId) await trackUsage(userId);
    return text;
  }

  throw new Error('No working AI service found.');
};

const extractJson = (text) => {
  try {
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7);
    if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3);
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3);
    cleanJson = cleanJson.trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw e;
  }
};

// --- CORE ENDPOINTS ---

router.post('/parse-resume', protect, checkUsageLimit, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 50) {
      return res.status(400).json({ success: false, message: 'Please provide valid resume text' });
    }

    const prompt = `You are an expert resume parser. Parse the following resume text and extract information into a structured JSON format.
    Return ONLY valid JSON, no markdown, no explanations.

    Resume Text:
    """
    ${text.substring(0, 10000)}
    """

    JSON structure:
    {
      "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "jobTitle": "", "summary": "",
      "skills": [], 
      "experiences": [{ "company": "", "position": "", "startDate": "", "endDate": "", "description": "" }],
      "educations": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
      "projects": [{ "name": "", "description": "", "technologies": "" }],
      "achievements": [{ "title": "", "description": "" }]
    }`;

    const responseText = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: extractJson(responseText) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/analyze-resume', protect, checkUsageLimit, async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;
    const isPremium = req.user.plan === 'premium' || req.user.plan === 'b2b';

    const prompt = `Analyze this resume for role: ${jobRole}.
    ${isPremium ? 'PREMIUM: Include ATS score (0-100) and 5 interview prep questions.' : 'FREE: Basic analysis.'}
    Return JSON: { "matchScore": 0, "skillsFound": [], "missingSkills": [], "strength": "", "recommendations": [] ${isPremium ? ', "atsScore": 0, "interviewQuestions": []' : ''} }
    RESUME: "${resumeText.substring(0, 8000)}"`;

    const responseText = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: extractJson(responseText) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/improve-content', protect, checkUsageLimit, async (req, res) => {
  try {
    const { text, type, jobTitle } = req.body;
    const prompt = `Improve this ${type || 'content'} for a ${jobTitle || 'professional'} resume. Use action verbs.
    TEXT: "${text}"
    Return ONLY improved text.`;
    const result = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: result.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/generate-summary', protect, checkUsageLimit, async (req, res) => {
  try {
    const { experiences, skills, jobTitle } = req.body;
    const prompt = `Generate a compelling professional summary for a ${jobTitle || 'professional'} resume.
    Exp: ${JSON.stringify(experiences)}
    Skills: ${skills?.join(', ')}
    Return ONLY the summary text (3-4 sentences).`;
    const result = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: result.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/suggest-skills', protect, checkUsageLimit, async (req, res) => {
  try {
    const { jobTitle, existingSkills } = req.body;
    const prompt = `Suggest 10 relevant skills for a ${jobTitle} role (avoiding ${existingSkills?.join(', ')}).
    Return ONLY a JSON array of strings: ["Skill 1", "Skill 2", ...]`;
    const responseText = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: extractJson(responseText) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- HR DASHBOARD & B2B ENDPOINTS ---

router.post('/analyze-candidate', protect, checkUsageLimit, async (req, res) => {
  try {
    const { resumeText, jobRole, jobDescription } = req.body;
    if (!resumeText || !jobRole) {
      return res.status(400).json({ success: false, message: 'Resume text and job role are required' });
    }

    const prompt = `You are an expert HR recruiter. Analyze the following resume against the job role and provide a detailed assessment.
    Job Role: ${jobRole}
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}

    Resume:
    """
    ${resumeText.substring(0, 6000)}
    """

    Return ONLY valid JSON:
    {
      "name": "Candidate's full name",
      "email": "candidate@email.com",
      "phone": "phone number",
      "matchScore": 0,
      "skills": [],
      "experience": "Brief summary of Exp",
      "education": "Brief summary of Edu",
      "missingSkills": [],
      "summary": "2-sentence specialized assessment"
    }`;

    const responseText = await generateContent(prompt, req.user._id);
    res.json({ success: true, data: extractJson(responseText) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alias for /generate-objective to support both naming conventions
const handleSummaryOptions = async (req, res) => {
  try {
    const { skills, experiences, education, targetRole, tone } = req.body;
    const prompt = `Generate 3 UNIQUE career objective options for a ${targetRole}.
    Skills: ${skills?.join(', ')}
    Exp: ${JSON.stringify(experiences)}
    Edu: ${JSON.stringify(education)}
    Tone: ${tone || 'Professional'}
    
    Return ONLY valid JSON:
    {
      "summaries": [
        { "type": "skills-focused", "text": "..." },
        { "type": "experience-focused", "text": "..." },
        { "type": "goals-focused", "text": "..." }
      ]
    }`;

    const responseText = await generateContent(prompt, req.user._id);
    const parsedData = extractJson(responseText);
    res.json({ success: true, summaries: parsedData.summaries || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post('/generate-objective', protect, checkUsageLimit, handleSummaryOptions);
router.post('/generate-summary-options', protect, checkUsageLimit, handleSummaryOptions);

router.post('/match-job', protect, checkUsageLimit, async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;
    if (!jobDescription || !resumeData) {
      return res.status(400).json({ success: false, message: 'JD and Resume data required' });
    }

    const prompt = `Analyze ATS match:
    JD: "${jobDescription.substring(0, 4000)}"
    Resume: ${JSON.stringify(resumeData)}
    
    Return ONLY valid JSON:
    {
      "overallScore": 0,
      "matchedSkills": [],
      "missingSkills": [],
      "matchedKeywords": [],
      "missingKeywords": [],
      "experienceAnalysis": { "required": "", "candidateHas": "", "match": true, "comment": "" },
      "educationAnalysis": { "required": "", "candidateHas": "", "match": true },
      "suggestions": [],
      "strengths": [],
      "overallVerdict": ""
    }`;

    const responseText = await generateContent(prompt, req.user._id);
    res.json({ success: true, result: extractJson(responseText) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// --- GENERAL ATS QUALITY CHECK (No Job Description needed) ---
// Replaces the broken regex-based analysis in the frontend.
router.post('/general-ats', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.length < 30) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }

    const prompt = `You are an expert ATS resume evaluator. Analyze the following resume and give a detailed, ACCURATE quality assessment.

IMPORTANT RULES:
- Indian phone numbers like +919042274067 or 9042274067 ARE valid phone numbers. Count them.
- Section headers can be ALL CAPS like "TECHNICAL SKILLS", "EXPERIENCES & MEMBERSHIP", "AREA OF INTEREST" — recognize them.
- Only list keywords that are actual technical skills, tools, or industry terms. NOT random capitalized words or abbreviations.
- Quantifiable results include percentages, numbers of projects, GPAs, grade percentages, years of experience.
- Action verbs include: built, developed, integrated, automated, designed, implemented, managed, created, deployed.

RESUME TEXT:
"""
${resumeText.substring(0, 8000)}
"""

Return ONLY valid JSON:
{
  "overallScore": <0-100>,
  "categoryScores": {
    "contactInfo": <0-15>,
    "resumeStructure": <0-20>,
    "actionVerbs": <0-15>,
    "quantifiableResults": <0-20>,
    "formatting": <0-15>,
    "keywords": <0-15>
  },
  "contactDetails": {
    "hasEmail": true,
    "hasPhone": true,
    "hasLinkedIn": true,
    "hasLocation": false,
    "notes": "what was found"
  },
  "sectionsFound": ["Education", "Skills", "Projects", "Experience"],
  "sectionsMissing": ["Professional Summary"],
  "actionVerbsFound": ["built", "integrated", "automated"],
  "quantifiableAchievements": ["CGPA: 8.27", "88% Grade"],
  "technicalKeywords": ["React.js", "Node.js", "MongoDB", "Python", "Git"],
  "formattingIssues": [],
  "strengths": ["Good project experience", "Multiple internships"],
  "suggestions": ["Add a professional summary section", "Quantify your project impact"]
}`;

    const responseText = await generateContent(prompt, null);
    const parsed = extractJson(responseText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('General ATS error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// This endpoint uses LLM to semantically understand technology relationships.
// Example: SpringBoot → Java, React → JavaScript, TensorFlow → Python
router.post('/semantic-ats', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Resume and Job Description are required' });
    }

    const prompt = `You are an expert technical HR analyst with deep knowledge of technology ecosystems and semantic relationships between skills.

CRITICAL INSTRUCTION: Do NOT do simple keyword matching. Instead, use your understanding of technology ecosystems.

SEMANTIC RULES you must apply:
- SpringBoot, Spring MVC, Hibernate → implies Java knowledge
- ReactJS, Redux, Next.js → implies JavaScript knowledge  
- Django, Flask, FastAPI, NumPy, Pandas → implies Python knowledge
- Laravel, Symfony → implies PHP knowledge
- Angular → implies TypeScript/JavaScript
- AWS Lambda, EC2, S3 → implies Cloud/DevOps knowledge
- Docker, Kubernetes → implies DevOps/containerization
- "5 years backend development" covers backend frameworks even if not all listed
- Domain-specific experience (e.g., fintech, healthtech) is a semantic match for domain expertise
- Leadership/management roles imply soft skills even if not explicitly listed

JOB DESCRIPTION:
"""
${jobDescription.substring(0, 4000)}
"""

CANDIDATE RESUME:
"""
${resumeText.substring(0, 6000)}
"""

Analyze semantically and return ONLY valid JSON (no markdown):
{
  "overallScore": <number 0-100>,
  "semanticMatches": [
    { "jobRequirement": "Java", "resumeEvidence": "SpringBoot (Spring implies Java)", "matchType": "semantic", "confidence": 95 }
  ],
  "directMatches": ["skill1", "skill2"],
  "inferredMatches": ["skill inferred from ecosystem knowledge"],
  "truelyMissing": ["skills genuinely absent with no ecosystem overlap"],
  "suggestions": ["Specific actionable suggestion"],
  "strengths": ["Key strength identified"],
  "verdict": "Short 2-sentence overall verdict for the recruiter",
  "hiringRecommendation": "Strong Yes / Yes / Maybe / No",
  "experienceMatch": { "required": "", "found": "", "score": 0 },
  "categoryScores": {
    "technicalSkills": <0-40>,
    "experienceRelevance": <0-30>,
    "educationAndCerts": <0-15>,
    "softSkillsAndCulture": <0-15>
  }
}`;

    const responseText = await generateContent(prompt, null);
    const parsed = extractJson(responseText);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Semantic ATS error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
