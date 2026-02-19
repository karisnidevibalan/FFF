const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const resumeService = {
  // Create new resume
  createResume: async (userId, title = 'My Resume', template = 'modern') => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId, title, template }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create resume');
      }

      return data;
    } catch (error) {
      console.error('Create resume error:', error);
      throw error;
    }
  },

  // Get all user resumes
  getUserResumes: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch resumes');
      }

      return data;
    } catch (error) {
      console.error('Get resumes error:', error);
      throw error;
    }
  },

  // Get single resume
  getResume: async (resumeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch resume');
      }

      return data;
    } catch (error) {
      console.error('Get resume error:', error);
      throw error;
    }
  },

  // Update resume
  updateResume: async (resumeId, resumeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update resume');
      }

      return data;
    } catch (error) {
      console.error('Update resume error:', error);
      throw error;
    }
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete resume');
      }

      return data;
    } catch (error) {
      console.error('Delete resume error:', error);
      throw error;
    }
  },

  // Get ATS Score
  getATSScore: async (resumeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/ats-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to calculate ATS score');
      }

      return data;
    } catch (error) {
      console.error('ATS score error:', error);
      throw error;
    }
  },
  // Analyze Resume
  analyzeResume: async (resumeText: string, jobRole: string = 'Frontend Developer') => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ resumeText, jobRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze resume');
      }

      return data;
    } catch (error) {
      console.error('Analyze resume error:', error);
      throw error;
    }
  },
};
