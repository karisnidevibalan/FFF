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

// =========== YOUR ENDPOINTS (HR Dashboard + Job Matcher) ===========

// Analyze single resume against job role (for HR Dashboard)
router.post('/analyze-candidate', async (req, res) => {
  try {
    const { resumeText, jobRole, jobDescription } = req.body;

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid resume text',
      });
    }

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job role',
      });
    }

    const prompt = `You are an expert HR recruiter and resume analyst. Analyze the following resume against the job role and provide a detailed assessment.

Job Role: ${jobRole}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Resume:
"""
${resumeText.substring(0, 6000)}
"""

Analyze and return ONLY valid JSON in this exact format:
{
  "name": "Candidate's full name",
  "email": "candidate@email.com",
  "phone": "phone number",
  "matchScore": 75,
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "X years in relevant field",
  "education": "Highest degree and institution",
  "missingSkills": ["missing skill 1", "missing skill 2"],
  "summary": "Brief 2-sentence assessment of the candidate"
}

Rules:
1. matchScore should be 0-100 based on how well candidate matches the job role
2. Extract actual skills mentioned in the resume
3. Be realistic with scoring
4. If information is not found, use "Not specified"`;

    const responseText = await generateContent(prompt);

    let parsedData;
    try {
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7);
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3);
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3);
      cleanJson = cleanJson.trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    res.status(200).json({
      success: true,
      candidate: parsedData,
    });

  } catch (error) {
    console.error('Candidate Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze candidate',
    });
  }
});

// Generate 3 unique career objective options
router.post('/generate-summary-options', async (req, res) => {
  try {
    const {
      targetRole,
      skills,
      experiences,
      education,
      tone
    } = req.body;

    const skillsList = skills?.map(s => s.name || s).join(', ') || '';

    const experienceContext = experiences?.length > 0
      ? experiences.map(exp =>
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}): ${exp.description || ''}`
      ).join('\n')
      : 'No prior experience';

    const educationContext = education?.length > 0
      ? education.map(edu =>
        `${edu.degree} in ${edu.field} from ${edu.school} (${edu.endDate || ''})`
      ).join('\n')
      : '';

    const toneInstruction = {
      professional: 'Use formal, corporate language. Focus on achievements and value.',
      creative: 'Use engaging, dynamic language. Show personality while remaining professional.',
      confident: 'Use strong, assertive language. Emphasize leadership and impact.',
      friendly: 'Use warm, approachable language. Highlight collaboration and teamwork.'
    }[tone] || 'Use professional yet engaging language.';

    const prompt = `You are an expert resume writer. Generate 3 UNIQUE and PERSONALIZED career objective/professional summary options.

CANDIDATE PROFILE:
- Target Role: ${targetRole || 'Not specified'}
- Skills: ${skillsList || 'Various skills'}
- Experience:
${experienceContext}
- Education:
${educationContext || 'Not specified'}

TONE: ${toneInstruction}

IMPORTANT RULES:
1. Each summary must be 2-4 sentences (50-100 words)
2. DO NOT include the candidate's name in the summary
3. Make each option DISTINCTLY DIFFERENT:
   - Option 1: Focus on SKILLS and TECHNICAL expertise
   - Option 2: Focus on EXPERIENCE and ACHIEVEMENTS  
   - Option 3: Focus on GOALS and VALUE proposition
4. Use SPECIFIC details from the profile
5. DO NOT use generic phrases like "seeking opportunities"
6. DO NOT start with "I am" - use third person or direct statements
7. Make it sound human, not robotic

Return ONLY valid JSON:
{
  "summaries": [
    { "type": "skills-focused", "text": "First summary..." },
    { "type": "experience-focused", "text": "Second summary..." },
    { "type": "goals-focused", "text": "Third summary..." }
  ]
}`;

    const responseText = await generateContent(prompt);

    let parsedData;
    try {
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7);
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3);
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3);
      cleanJson = cleanJson.trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    res.status(200).json({
      success: true,
      summaries: parsedData.summaries || [],
    });

  } catch (error) {
    console.error('Summary Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate summary',
    });
  }
});

// Job Description Matcher - AI Analysis
router.post('/match-job', async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription || jobDescription.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid job description (at least 50 characters)',
      });
    }

    const skills = resumeData?.skills?.map(s => s.name || s).join(', ') || '';
    const experience = resumeData?.experience?.map(exp =>
      `${exp.position || exp.title} at ${exp.company}: ${exp.description || ''}`
    ).join('\n') || 'No experience listed';
    const education = resumeData?.education?.map(edu =>
      `${edu.degree} in ${edu.field || edu.major} from ${edu.school || edu.institution}`
    ).join('\n') || '';
    const summary = resumeData?.personalInfo?.summary || '';

    const prompt = `You are an expert ATS and HR recruiter. Analyze how well this candidate's resume matches the job description.

JOB DESCRIPTION:
"""
${jobDescription.substring(0, 4000)}
"""

CANDIDATE'S RESUME:
- Summary: ${summary}
- Skills: ${skills}
- Experience:
${experience}
- Education:
${education}

Return ONLY valid JSON:
{
  "overallScore": 75,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3"],
  "experienceAnalysis": {
    "required": "3+ years",
    "candidateHas": "2 years",
    "match": false,
    "comment": "Brief comment"
  },
  "educationAnalysis": {
    "required": "Bachelor's degree",
    "candidateHas": "Bachelor's in CS",
    "match": true
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "strengths": ["Strength 1", "Strength 2"],
  "overallVerdict": "Good match with minor gaps"
}`;

    const responseText = await generateContent(prompt);

    let parsedData;
    try {
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7);
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3);
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3);
      cleanJson = cleanJson.trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    res.status(200).json({
      success: true,
      result: parsedData,
    });

  } catch (error) {
    console.error('Job Match Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze job match',
    });
  }
});

// Analyze resume specifically for a job role
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText, jobRole = 'Frontend Developer' } = req.body;

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid resume text',
      });
    }

    const prompt = `You are an expert AI Resume Analyzer.

Your task is to analyze the uploaded resume for the target job role: ${jobRole}.

Step 1: Extract all frontend-related skills from the resume.

Step 2: Compare the extracted skills with the standard Frontend skill set below.

Basic Required Skills:
- HTML
- CSS
- JavaScript

Advanced Frontend Skills:
- React.js
- Next.js
- TypeScript
- Tailwind CSS
- Bootstrap
- Redux
- REST API Integration
- Git and GitHub
- Responsive Web Design
- Cross-Browser Compatibility
- Web Performance Optimization
- UI/UX Design Understanding

Step 3: Evaluate the resume and provide output in the following structured JSON format:

{
  "frontendMatchScore": 0, // Percentage number 0-100
  "basicSkillsFound": ["skill1", "skill2"],
  "advancedSkillsFound": ["skill1", "skill2"],
  "missingAdvancedSkills": ["skill1", "skill2"],
  "resumeStrengthLevel": "Weak/Average/Strong",
  "advancedSkillsRecommendations": ["skill1", "skill2"],
  "projectRecommendations": [
    {
      "title": "Project Title",
      "description": "Project Description"
    },
    {
      "title": "Project Title",
      "description": "Project Description"
    }
  ],
  "finalImprovementSuggestions": ["suggestion1", "suggestion2"]
}

Important Instructions:
- Be precise and professional
- Focus on improving resume strength
- Help the candidate become industry‑ready
- Return ONLY valid JSON, no markdown formatting.

Resume Text:
"""
${resumeText.substring(0, 10000)}
"""`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    let analysisData;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.slice(7);
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
      cleanJson = cleanJson.trim();

      analysisData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback extraction
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    res.status(200).json({
      success: true,
      data: analysisData,
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
    });
  }
});

export default router;
