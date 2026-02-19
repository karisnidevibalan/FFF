import express from 'express';
import Resume from '../models/Resume.js';
import { atsKeywords } from '../models/TemplateData.js';

const router = express.Router();

// Calculate ATS Score
function calculateATSScore(resumeData) {
  let score = 50; // Base score
  let issues = [];

  // Check personal info (10 points)
  if (resumeData.personalInfo?.fullName) score += 5;
  if (resumeData.personalInfo?.email && resumeData.personalInfo?.phone) score += 5;

  // Check experience (20 points)
  if (resumeData.experience?.length > 0) {
    score += Math.min(resumeData.experience.length * 5, 15);
  } else {
    issues.push('Add work experience to improve ATS score');
  }

  // Check education (10 points)
  if (resumeData.education?.length > 0) score += 10;
  else issues.push('Add education details');

  // Check skills (15 points)
  if (resumeData.skills?.length > 0) {
    score += Math.min(resumeData.skills.length * 2, 15);
  } else {
    issues.push('Add at least 5 skills');
  }

  // Check keywords (15 points)
  const fullText = JSON.stringify(resumeData).toLowerCase();
  const keywordMatches = atsKeywords.hardSkills.filter(keyword =>
    fullText.includes(keyword)
  ).length;
  score += Math.min(keywordMatches * 1.5, 15);

  // Check action verbs (10 points)
  const actionVerbMatches = atsKeywords.actionVerbs.filter(verb =>
    fullText.includes(verb)
  ).length;
  score += Math.min(actionVerbMatches, 10);

  // Check projects (10 points)
  if (resumeData.projects?.length > 0) score += 10;

  score = Math.min(score, 100);
  return { score: Math.round(score), issues };
}

// Create resume
router.post('/create', async (req, res) => {
  try {
    const { userId, title, template } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required',
      });
    }

    const resume = await Resume.create({
      userId,
      title: title || 'My Resume',
      template: template || 'modern',
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all resumes for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single resume
router.get('/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update resume
router.put('/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const updateData = req.body;

    // Calculate ATS score
    const atsData = calculateATSScore(updateData);
    updateData.atsScore = atsData.score;
    updateData.updatedAt = new Date();

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume,
      atsScore: atsData.score,
      issues: atsData.issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete resume
router.delete('/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get ATS Score
router.post('/:resumeId/ats-score', async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const atsData = calculateATSScore(resume.toObject());

    res.status(200).json({
      success: true,
      score: atsData.score,
      issues: atsData.issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Export resume as PDF
router.post('/:resumeId/export-pdf', async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Convert resume data to HTML format for PDF
    const htmlContent = generateResumeHTML(resume.toObject());

    res.status(200).json({
      success: true,
      data: resume,
      htmlContent,
      message: 'Resume data ready for PDF export',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Helper function to generate HTML from resume data
function generateResumeHTML(resume) {
  const personalInfo = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const languages = resume.languages || [];

  let experienceHTML = '';
  experience.forEach(exp => {
    experienceHTML += `
      <div style="margin-bottom: 15px;">
        <h4 style="font-weight: bold; margin: 0 0 5px 0;">${exp.jobTitle || ''} at ${exp.company || ''}</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
          ${exp.startDate || ''} - ${exp.endDate || 'Present'}
        </p>
        <p style="margin: 0;">${exp.description || ''}</p>
      </div>
    `;
  });

  let educationHTML = '';
  education.forEach(edu => {
    educationHTML += `
      <div style="margin-bottom: 15px;">
        <h4 style="font-weight: bold; margin: 0 0 5px 0;">${edu.degree || ''} in ${edu.fieldOfStudy || ''}</h4>
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
          ${edu.institution || ''} (${edu.graduationYear || ''})
        </p>
      </div>
    `;
  });

  let skillsHTML = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
  skills.forEach(skill => {
    skillsHTML += `<span style="background: #e0e7ff; padding: 5px 10px; border-radius: 4px; font-size: 12px;">${skill.name || ''}</span>`;
  });
  skillsHTML += '</div>';

  let projectsHTML = '';
  projects.forEach(project => {
    projectsHTML += `
      <div style="margin-bottom: 15px;">
        <h4 style="font-weight: bold; margin: 0 0 5px 0;">${project.title || ''}</h4>
        <p style="margin: 0;">${project.description || ''}</p>
      </div>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
        }
        .container {
          max-width: 8.5in;
          height: 11in;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .name {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        .contact {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .summary {
          font-size: 12px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${personalInfo.fullName || 'Your Name'}</h1>
          <div class="contact">
            ${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}
          </div>
        </div>

        ${personalInfo.professionalSummary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p class="summary">${personalInfo.professionalSummary}</p>
          </div>
        ` : ''}

        ${experienceHTML ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${experienceHTML}
          </div>
        ` : ''}

        ${educationHTML ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${educationHTML}
          </div>
        ` : ''}

        ${skillsHTML ? `
          <div class="section">
            <div class="section-title">Skills</div>
            ${skillsHTML}
          </div>
        ` : ''}

        ${projectsHTML ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projectsHTML}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  return html;
}

// Generate unique share ID
function generateShareId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create shareable link
router.post('/:resumeId/share', async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Generate share ID if not exists
    if (!resume.shareId) {
      resume.shareId = generateShareId();
    }
    resume.isPublic = true;
    await resume.save();

    res.status(200).json({
      success: true,
      shareId: resume.shareId,
      shareUrl: `/share/${resume.shareId}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get public resume by share ID
router.get('/public/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const resume = await Resume.findOne({ shareId, isPublic: true });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or not public',
      });
    }

    // Increment view count
    resume.analytics.totalViews += 1;
    resume.analytics.viewHistory.push({
      date: new Date(),
      count: 1,
      country: req.headers['cf-ipcountry'] || 'Unknown',
      source: req.headers['referer'] || 'Direct',
    });
    await resume.save();

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Track resume view
router.post('/track-view/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const { source, country } = req.body;
    
    const resume = await Resume.findOne({ shareId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    resume.analytics.totalViews += 1;
    resume.analytics.viewHistory.push({
      date: new Date(),
      count: 1,
      country: country || 'Unknown',
      source: source || 'Direct',
    });
    await resume.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Track download
router.post('/:resumeId/track-download', async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    resume.analytics.totalDownloads += 1;
    await resume.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get analytics
router.get('/:resumeId/analytics', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { range = '30d' } = req.query;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Calculate date range
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Filter view history
    const filteredHistory = resume.analytics.viewHistory.filter(
      v => new Date(v.date) >= startDate
    );

    // Aggregate by day
    const viewsByDay = {};
    filteredHistory.forEach(v => {
      const dateKey = new Date(v.date).toISOString().split('T')[0];
      viewsByDay[dateKey] = (viewsByDay[dateKey] || 0) + v.count;
    });

    // Aggregate by location
    const viewsByLocation = {};
    filteredHistory.forEach(v => {
      viewsByLocation[v.country] = (viewsByLocation[v.country] || 0) + v.count;
    });

    // Aggregate by source
    const viewsBySource = {};
    filteredHistory.forEach(v => {
      viewsBySource[v.source] = (viewsBySource[v.source] || 0) + v.count;
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalViews: resume.analytics.totalViews,
        totalDownloads: resume.analytics.totalDownloads,
        totalShares: resume.analytics.totalShares,
        viewsByDay: Object.entries(viewsByDay).map(([date, views]) => ({ date, views })),
        viewsByLocation: Object.entries(viewsByLocation).map(([country, views]) => ({
          country,
          views,
          percentage: Math.round((views / filteredHistory.length) * 100),
        })),
        viewsBySource: Object.entries(viewsBySource).map(([source, views]) => ({
          source,
          views,
          percentage: Math.round((views / filteredHistory.length) * 100),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Disable sharing
router.delete('/:resumeId/share', async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    resume.isPublic = false;
    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Sharing disabled',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
