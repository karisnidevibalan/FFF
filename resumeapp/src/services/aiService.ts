const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const aiService = {
    improveContent: async (text: string, type?: string, jobTitle?: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/improve-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ text, type, jobTitle }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to improve content');
            return data.data;
        } catch (error) {
            console.error('AI Improve error:', error);
            throw error;
        }
    },

    generateSummary: async (experiences: any[], skills: string[], jobTitle: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ experiences, skills, jobTitle }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to generate summary');
            return data.data;
        } catch (error) {
            console.error('AI Summary error:', error);
            throw error;
        }
    },

    suggestSkills: async (jobTitle: string, existingSkills: string[]) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/suggest-skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ jobTitle, existingSkills }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to suggest skills');
            return data.data;
        } catch (error) {
            console.error('AI Skills error:', error);
            throw error;
        }
    }
};
