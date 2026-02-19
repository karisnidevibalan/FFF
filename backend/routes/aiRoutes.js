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
      model: 'llama-3.3-70b-versatile',
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

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.

Analyze and return this exact JSON structure:
{
  "candidateName": "Full name from resume",
  "email": "Email if found",
  "phone": "Phone if found",
  "matchScore": 75,
  "experience": "X years",
  "education": "Highest degree",
  "currentRole": "Current/recent job title",
  "skills": ["skill1", "skill2", "skill3"],
  "matchingSkills": ["skills that match the job"],
  "missingSkills": ["skills required but not found"],
  "strengths": ["key strengths for this role"],
  "concerns": ["potential concerns or gaps"],
  "recommendation": "Short recommendation (1-2 sentences)"
}

Rules:
1. matchScore should be 0-100 based on how well the candidate fits the role
2. Consider skills match, experience level, education relevance
3. Be realistic with scores - 90+ should be exceptional matches only
4. List actual skills found in resume, not generic ones
5. Return ONLY JSON`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
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
      data: {
        name: parsedData.candidateName || 'Unknown',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        matchScore: Math.min(100, Math.max(0, parseInt(parsedData.matchScore) || 50)),
        experience: parsedData.experience || 'Not specified',
        education: parsedData.education || 'Not specified',
        currentRole: parsedData.currentRole || '',
        skills: parsedData.skills || [],
        matchingSkills: parsedData.matchingSkills || [],
        missingSkills: parsedData.missingSkills || [],
        strengths: parsedData.strengths || [],
        concerns: parsedData.concerns || [],
        recommendation: parsedData.recommendation || '',
      },
    });

  } catch (error) {
    console.error('Candidate Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze candidate',
    });
  }
});

// Generate personalized career objective/summary
router.post('/generate-summary', async (req, res) => {
  try {
    const { 
      fullName, 
      skills, 
      experiences, 
      education, 
      targetRole,
      tone // professional, creative, confident, friendly
    } = req.body;

    // Build context from user data
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
2. DO NOT include the candidate's name in the summary - the name is already on the resume header
3. Make each option DISTINCTLY DIFFERENT in approach:
   - Option 1: Focus on SKILLS and TECHNICAL expertise
   - Option 2: Focus on EXPERIENCE and ACHIEVEMENTS  
   - Option 3: Focus on GOALS and VALUE proposition
4. Use SPECIFIC details from the profile (company names, skill names, degree)
5. DO NOT use generic phrases like "seeking opportunities" or "looking for challenging role"
6. DO NOT start with "I am" - use third person or direct statements
7. Make it sound human, not robotic
8. Include measurable achievements if experience is provided
9. Tailor it specifically for the target role if provided

Return ONLY valid JSON in this format:
{
  "summaries": [
    {
      "type": "skills-focused",
      "text": "First personalized summary..."
    },
    {
      "type": "experience-focused", 
      "text": "Second personalized summary..."
    },
    {
      "type": "goals-focused",
      "text": "Third personalized summary..."
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8, // Higher temperature for more creativity/uniqueness
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
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

export default router;
