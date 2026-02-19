import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
${text.substring(0, 8000)}
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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Try to parse the JSON response
    let parsedData;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanJson = responseText.trim();
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

      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response:', responseText);

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    // Ensure all required fields exist
    const result = {
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
      data: result,
    });

  } catch (error) {
    console.error('AI Parse Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume',
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
