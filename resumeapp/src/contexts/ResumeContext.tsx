import React, { createContext, useContext, useState } from 'react';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  summary: string;
  profilePhoto: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
}

export interface CustomSectionItem {
  id: string;
  content: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  skills: Skill[];
  publications: Publication[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  template: 'classic' | 'modern' | 'creative' | 'professional' | 'academic';
}

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  loadResumeData: (data: Partial<ResumeData>) => void;
  clearResumeData: () => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addAchievement: () => void;
  updateAchievement: (id: string, data: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addCustomSection: (title: string) => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  removeCustomSection: (sectionId: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, content: string) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  removePublication: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  setTemplate: (template: 'classic' | 'modern' | 'creative' | 'professional' | 'academic') => void;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
    summary: '',
    profilePhoto: '',
  },
  education: [],
  experience: [],
  projects: [],
  achievements: [],
  skills: [],
  customSections: [],
  publications: [],
  certifications: [],
  languages: [],
  template: 'classic',
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

// Storage key for resume data
const STORAGE_KEY = 'resumeBuilderData';

// Get saved data from localStorage
const getSavedData = (): ResumeData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultResumeData, ...parsed };
    }
  } catch (e) {
    console.error('Error loading saved resume:', e);
  }
  return defaultResumeData;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => getSavedData());

  // Save to localStorage whenever resumeData changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (e) {
      console.error('Error saving resume:', e);
    }
  }, [resumeData]);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  // Load bulk resume data (for importing uploaded resumes)
  const loadResumeData = (data: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: data.personalInfo ? { ...prev.personalInfo, ...data.personalInfo } : prev.personalInfo,
      education: data.education && data.education.length > 0 ? data.education : prev.education,
      experience: data.experience && data.experience.length > 0 ? data.experience : prev.experience,
      projects: data.projects && data.projects.length > 0 ? data.projects : prev.projects,
      achievements: data.achievements && data.achievements.length > 0 ? data.achievements : prev.achievements,
      skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
      customSections: data.customSections && data.customSections.length > 0 ? data.customSections : prev.customSections,
    }));
  };

  // Clear all resume data (start fresh)
  const clearResumeData = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...data } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, data: Partial<Experience>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...data } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: '',
      link: '',
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, ...data } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addAchievement = () => {
    const newAch: Achievement = {
      id: generateId(),
      title: '',
      description: '',
      date: '',
    };
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAch]
    }));
  };

  const updateAchievement = (id: string, data: Partial<Achievement>) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map(ach =>
        ach.id === id ? { ...ach, ...data } : ach
      )
    }));
  };

  const removeAchievement = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(ach => ach.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      proficiency: 50,
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, data: Partial<Skill>) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, ...data } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addCustomSection = (title: string) => {
    const newSection: CustomSection = {
      id: generateId(),
      title: title || 'Custom Section',
      items: [],
    };
    setResumeData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === sectionId ? { ...section, title } : section
      )
    }));
  };

  const removeCustomSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== sectionId)
    }));
  };

  const addCustomSectionItem = (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: generateId(),
      content: '',
    };
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    }));
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, content: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, content } : item
            )
          }
          : section
      )
    }));
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
    }));
  };

  const setTemplate = (template: 'classic' | 'modern' | 'creative' | 'professional' | 'academic') => {
    setResumeData(prev => ({ ...prev, template }));
  };

  const addPublication = () => {
    const newPub: Publication = {
      id: generateId(),
      title: '',
      publisher: '',
      date: '',
      link: '',
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      publications: [...prev.publications, newPub]
    }));
  };

  const updatePublication = (id: string, data: Partial<Publication>) => {
    setResumeData(prev => ({
      ...prev,
      publications: prev.publications.map(pub =>
        pub.id === id ? { ...pub, ...data } : pub
      )
    }));
  };

  const removePublication = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      publications: prev.publications.filter(pub => pub.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      link: '',
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, data: Partial<Certification>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, ...data } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: generateId(),
      language: '',
      proficiency: 'Intermediate',
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: string, data: Partial<Language>) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, ...data } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      updatePersonalInfo,
      loadResumeData,
      clearResumeData,
      addEducation,
      updateEducation,
      removeEducation,
      addExperience,
      updateExperience,
      removeExperience,
      addProject,
      updateProject,
      removeProject,
      addAchievement,
      updateAchievement,
      removeAchievement,
      addSkill,
      updateSkill,
      removeSkill,
      addCustomSection,
      updateCustomSectionTitle,
      removeCustomSection,
      addCustomSectionItem,
      updateCustomSectionItem,
      removeCustomSectionItem,
      addPublication,
      updatePublication,
      removePublication,
      addCertification,
      updateCertification,
      removeCertification,
      addLanguage,
      updateLanguage,
      removeLanguage,
      setTemplate,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
