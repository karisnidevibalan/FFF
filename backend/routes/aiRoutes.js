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

export default router;
