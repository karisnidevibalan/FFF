import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Download, 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Award, 
  Wrench,
  LayoutTemplate,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  List,
  PlusCircle,
  Mic,
  Sparkles,
  Loader2,
  Camera,
  X,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';

// Template options - matches Templates.tsx
const templateOptions = [
  { id: 'cosmos', name: 'Cosmos', style: 'sidebar-left' },
  { id: 'celestial', name: 'Celestial', style: 'centered' },
  { id: 'galaxy', name: 'Galaxy', style: 'sidebar-photo' },
  { id: 'aurora', name: 'Aurora', style: 'header-gradient' },
  { id: 'lunar', name: 'Lunar', style: 'sidebar-right' },
  { id: 'eclipse', name: 'Eclipse', style: 'sidebar-photo-alt' },
  { id: 'nebula', name: 'Nebula', style: 'modern-clean' },
  { id: 'stellar', name: 'Stellar', style: 'minimal' },
  { id: 'orbit', name: 'Orbit', style: 'creative' },
  { id: 'executive', name: 'Executive', style: 'professional' },
  { id: 'modern', name: 'Modern', style: 'two-column' },
  { id: 'classic', name: 'Classic', style: 'traditional' },
  { id: 'minimalist', name: 'Minimalist', style: 'clean' },
  { id: 'creative', name: 'Creative', style: 'bold' },
  { id: 'professional', name: 'Professional', style: 'corporate' },
  { id: 'nova', name: 'Nova', style: 'ats-two-column' },
  { id: 'eon', name: 'Eon', style: 'ats-sidebar' },
  { id: 'solstice', name: 'Solstice', style: 'ats-clean' },
  { id: 'zenith', name: 'Zenith', style: 'ats-minimal' },
  { id: 'apex', name: 'Apex', style: 'ats-professional' },
  { id: 'horizon', name: 'Horizon', style: 'ats-modern' },
  { id: 'pinnacle', name: 'Pinnacle', style: 'ats-executive' },
  { id: 'vertex', name: 'Vertex', style: 'ats-bold' },
];

// Color accent options
const colorOptions = [
  { id: 'slate', name: 'Slate', primary: '#475569', secondary: '#f1f5f9' },
  { id: 'blue', name: 'Blue', primary: '#2563eb', secondary: '#eff6ff' },
  { id: 'emerald', name: 'Emerald', primary: '#059669', secondary: '#ecfdf5' },
  { id: 'purple', name: 'Purple', primary: '#7c3aed', secondary: '#f5f3ff' },
  { id: 'rose', name: 'Rose', primary: '#e11d48', secondary: '#fff1f2' },
  { id: 'amber', name: 'Amber', primary: '#d97706', secondary: '#fffbeb' },
  { id: 'cyan', name: 'Cyan', primary: '#0891b2', secondary: '#ecfeff' },
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5', secondary: '#eef2ff' },
];

const Builder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlTemplate = searchParams.get('template') || 'cosmos';
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const lastFocusedInput = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(urlTemplate);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [selectedColor, setSelectedColor] = useState('slate');
  const [isMonochrome, setIsMonochrome] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // Track last focused input/textarea
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        lastFocusedInput.current = target as HTMLInputElement | HTMLTextAreaElement;
        const label = target.closest('div')?.querySelector('label')?.textContent || 'field';
        setFocusedField(label);
      }
    };
    
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  const {
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
    setTemplate,
  } = useResume();

  // Set template from URL on mount
  useEffect(() => {
    if (urlTemplate) {
      setSelectedTemplate(urlTemplate);
      setTemplate(urlTemplate as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTemplate]);

  // Handle "Create New" - clear data when new=true
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isNew = searchParams.get('new') === 'true';
    
    if (isNew) {
      clearResumeData();
      // Remove new param from URL
      const newUrl = window.location.pathname + '?template=' + urlTemplate;
      window.history.replaceState({}, '', newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load uploaded resume data from localStorage
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isUploaded = searchParams.get('uploaded') === 'true';
    
    if (isUploaded) {
      const savedData = localStorage.getItem('uploadedResumeData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          
          // Check if data is fresh (within 5 minutes)
          if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
            const generateId = () => Math.random().toString(36).substring(2, 9);
            
            // Prepare resume data with proper structure
            const resumeToLoad: any = {};
            
            // Personal info - include all fields
            if (parsed.personalInfo) {
              resumeToLoad.personalInfo = {
                fullName: parsed.personalInfo.fullName || '',
                email: parsed.personalInfo.email || '',
                phone: parsed.personalInfo.phone || '',
                linkedin: parsed.personalInfo.linkedin || '',
                location: parsed.personalInfo.location || '',
                summary: parsed.personalInfo.summary || '',
              };
            }
            
            // Skills - convert to proper format
            if (parsed.skills && parsed.skills.length > 0) {
              resumeToLoad.skills = parsed.skills.map((skillName: string) => ({
                id: generateId(),
                name: skillName,
                proficiency: 80
              }));
            }
            
            // Experiences - convert to proper format with all fields
            if (parsed.experiences && parsed.experiences.length > 0) {
              resumeToLoad.experience = parsed.experiences.map((exp: any) => ({
                id: generateId(),
                company: exp.company || '',
                position: exp.position || '',
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || 'Present',
                current: exp.endDate?.toLowerCase().includes('present') || false,
                description: exp.description || ''
              }));
            }
            
            // Education - convert to proper format with all fields
            if (parsed.educations && parsed.educations.length > 0) {
              resumeToLoad.education = parsed.educations.map((edu: any) => ({
                id: generateId(),
                school: edu.school || '',
                degree: edu.degree || '',
                field: edu.field || '',
                startDate: edu.startDate || '',
                endDate: edu.endDate || '',
                gpa: edu.grade || edu.gpa || ''
              }));
            }
            
            // Achievements - convert to proper format
            if (parsed.achievements && parsed.achievements.length > 0) {
              resumeToLoad.achievements = parsed.achievements.map((ach: any) => ({
                id: generateId(),
                title: ach.title || '',
                description: ach.description || '',
                date: ''
              }));
            }
            
            // Projects - convert to proper format
            if (parsed.projects && parsed.projects.length > 0) {
              resumeToLoad.projects = parsed.projects.map((proj: any) => ({
                id: generateId(),
                name: proj.name || '',
                description: proj.description || '',
                technologies: proj.technologies || '',
                link: ''
              }));
            }
            
            // Load the resume data
            loadResumeData(resumeToLoad);
            
            // Clear the localStorage after loading
            localStorage.removeItem('uploadedResumeData');
            
            // Remove uploaded param from URL
            const newUrl = window.location.pathname + '?template=' + urlTemplate;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (e) {
          console.error('Error loading uploaded resume:', e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('resume.pdf');
  };

  // Simple voice input - works with last focused field
  const startVoice = () => {
    const activeEl = lastFocusedInput.current;
    if (!activeEl) {
      alert('First click on a text field, then click the mic button');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice not supported. Use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log('Voice started for:', focusedField);
      setIsListening(true);
    };
    
    recognition.onresult = (e: any) => {
      let text = e.results[0][0].transcript.trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);
      console.log('Voice result:', text);
      
      const isTextarea = activeEl.tagName === 'TEXTAREA';
      const currentVal = activeEl.value;
      
      let newValue: string;
      if (isTextarea && currentVal) {
        const sep = currentVal.endsWith('.') ? ' ' : '. ';
        newValue = currentVal + sep + text;
      } else {
        newValue = text;
      }
      
      // Use native setter to trigger React
      const nativeSetter = Object.getOwnPropertyDescriptor(
        isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
        'value'
      )?.set;
      
      if (nativeSetter) {
        nativeSetter.call(activeEl, newValue);
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Value set to:', newValue);
      }
      
      activeEl.focus();
    };

    recognition.onerror = (e: any) => {
      console.log('Voice error:', e.error);
      setIsListening(false);
      if (e.error === 'not-allowed') {
        alert('Please allow microphone access');
      }
    };
    
    recognition.onend = () => {
      console.log('Voice ended');
      setIsListening(false);
    };

    recognition.start();
  };

  // AI Generate Professional Summary
  const generateAISummary = async () => {
    setIsGeneratingAI(true);
    
    // Gather user data
    const { personalInfo, experience, skills, education } = resumeData;
    
    // Generate AI-like summary (template-based for now)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI delay
    
    let summary = '';
    const skillNames = skills.map(s => s.name).filter(Boolean);
    
    if (experience.length > 0 && skillNames.length > 0) {
      const yearsExp = experience.length > 2 ? 'seasoned' : experience.length > 0 ? 'experienced' : 'aspiring';
      const topSkills = skillNames.slice(0, 3).join(', ');
      const latestRole = experience[0];
      
      summary = `${yearsExp.charAt(0).toUpperCase() + yearsExp.slice(1)} professional with expertise in ${topSkills}. ${latestRole ? `Currently serving as ${latestRole.position}${latestRole.company ? ` at ${latestRole.company}` : ''}, ` : ''}demonstrating strong capabilities in ${skillNames[0] || 'various technologies'}. ${education.length > 0 ? `Holds ${education[0].degree} in ${education[0].field} from ${education[0].school}. ` : ''}Passionate about delivering high-quality results and continuously improving skills to drive business success.`;
    } else if (skillNames.length > 0) {
      summary = `Motivated professional with strong skills in ${skillNames.join(', ')}. Eager to leverage technical expertise and problem-solving abilities to contribute to team success. Committed to continuous learning and professional development.`;
    } else if (education.length > 0) {
      summary = `Recent graduate with ${education[0].degree} in ${education[0].field} from ${education[0].school}. Eager to apply academic knowledge and fresh perspectives to real-world challenges. Quick learner with strong analytical skills and a passion for growth.`;
    } else {
      summary = `Dynamic and motivated professional seeking to leverage skills and experience to drive organizational success. Strong communicator with excellent problem-solving abilities and a commitment to continuous improvement.`;
    }
    
    updatePersonalInfo({ summary });
    setIsGeneratingAI(false);
  };

  const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    onAdd?: () => void;
  }> = ({ icon, title, onAdd }) => (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-bg text-primary-foreground">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {onAdd && (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onAdd();
          }}
          className="gap-1 gradient-bg"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      )}
    </div>
  );

  return (
    <Layout hideFooter>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 left-1/4 -translate-x-1/2 z-50">
        <Button
          onClick={startVoice}
          size="lg"
          className={cn(
            'rounded-full w-14 h-14 shadow-xl',
            isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'gradient-bg'
          )}
          title="Click a field first, then click to speak"
        >
          <Mic className="w-6 h-6" />
        </Button>
        {(isListening || focusedField) && (
          <div className={cn(
            'absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg',
            isListening ? 'bg-red-500 text-white' : 'bg-card border'
          )}>
            {isListening ? '🔴 Listening...' : `🎤 ${focusedField}`}
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r border-border overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Resume Builder</h1>
                <p className="text-muted-foreground">Fill in your details to create your resume</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={startVoice}
                  variant={isListening ? "destructive" : "outline"}
                  className={isListening ? "animate-pulse" : ""}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isListening ? "Listening..." : "Voice"}
                </Button>
                <Button onClick={downloadPDF} className="gradient-bg">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <LayoutTemplate className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Choose Template</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {templateOptions.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setTemplate(template.id as any);
                    }}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all capitalize text-sm font-medium',
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              
              {/* Color Selection */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Accent Color</span>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={isMonochrome}
                      onCheckedChange={(checked) => setIsMonochrome(checked as boolean)}
                    />
                    Monochrome
                  </label>
                </div>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        selectedColor === color.id && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: isMonochrome ? '#475569' : color.primary }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader icon={<User className="w-4 h-4" />} title="Personal Information" />
              <div className="p-4 space-y-4">
                  {/* Profile Photo Upload - Only for photo templates */}
                  {(selectedTemplate === 'galaxy' || selectedTemplate === 'eclipse') && (
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="relative">
                        {resumeData.personalInfo.profilePhoto ? (
                          <div className="relative">
                            <img 
                              src={resumeData.personalInfo.profilePhoto} 
                              alt="Profile" 
                              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                            />
                            <button
                              onClick={() => updatePersonalInfo({ profilePhoto: '' })}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                            <Camera className="w-6 h-6 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground mt-1">Add Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    updatePersonalInfo({ profilePhoto: event.target?.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile Photo</p>
                        <p className="text-xs text-muted-foreground">Upload a professional photo for your resume</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        placeholder="San Francisco, CA"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input
                      placeholder="linkedin.com/in/johndoe"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label>Professional Summary</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={generateAISummary}
                        disabled={isGeneratingAI}
                        className="gap-1 text-xs h-7"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Write a brief summary of your professional background..."
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
            </div>

            {/* Education */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader 
                icon={<GraduationCap className="w-4 h-4" />} 
                title="Education" 
                onAdd={addEducation}
              />
              <div className="p-4 space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label>School/University</Label>
                            <Input
                              placeholder="Harvard University"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Degree</Label>
                            <Input
                              placeholder="Bachelor's"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Field of Study</Label>
                            <Input
                              placeholder="Computer Science"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              placeholder="3.8/4.0"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              placeholder="Sep 2018"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              placeholder="May 2022"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive ml-2"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {resumeData.education.length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No education added yet. Click "+ Add" above to add your education.
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Experience */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader 
                icon={<Briefcase className="w-4 h-4" />} 
                title="Work Experience" 
                onAdd={addExperience}
              />
              <div className="p-4 space-y-4">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label>Company</Label>
                            <Input
                              placeholder="Google Inc."
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              placeholder="Mountain View, CA"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                            />
                          </div>
                          <div className="flex items-end gap-4">
                            <div className="flex-1">
                              <Label>Start Date</Label>
                              <Input
                                placeholder="Jan 2020"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 col-span-2">
                            <Checkbox
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onCheckedChange={(checked) => 
                                updateExperience(exp.id, { current: !!checked, endDate: checked ? 'Present' : '' })
                              }
                            />
                            <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                          </div>
                          {!exp.current && (
                            <div className="col-span-2">
                              <Label>End Date</Label>
                              <Input
                                placeholder="Dec 2023"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                              />
                            </div>
                          )}
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements..."
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive ml-2"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No experience added yet. Click "+ Add" above to add your work experience.
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Projects */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader 
                icon={<FolderOpen className="w-4 h-4" />} 
                title="Projects" 
                onAdd={addProject}
              />
              <div className="p-4 space-y-4">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label>Project Name</Label>
                            <Input
                              placeholder="E-commerce Platform"
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Link (Optional)</Label>
                            <Input
                              placeholder="github.com/project"
                              value={proj.link}
                              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Technologies Used</Label>
                            <Input
                              placeholder="React, Node.js, PostgreSQL"
                              value={proj.technologies}
                              onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your project..."
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                              rows={3}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive ml-2"
                          onClick={() => removeProject(proj.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {resumeData.projects.length === 0 && (
                    <div className="text-center py-8">
                      <FolderOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No projects added yet. Click "+ Add" above to add your first project.
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader 
                icon={<Award className="w-4 h-4" />} 
                title="Achievements" 
                onAdd={addAchievement}
              />
              <div className="p-4 space-y-4">
                  {resumeData.achievements.map((ach) => (
                    <div key={ach.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label>Title</Label>
                            <Input
                              placeholder="Best Paper Award"
                              value={ach.title}
                              onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Date</Label>
                            <Input
                              placeholder="June 2023"
                              value={ach.date}
                              onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your achievement..."
                              value={ach.description}
                              onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive ml-2"
                          onClick={() => removeAchievement(ach.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {resumeData.achievements.length === 0 && (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No achievements added yet. Click "+ Add" above to add your achievements.
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Skills */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <SectionHeader 
                icon={<Wrench className="w-4 h-4" />} 
                title="Skills" 
                onAdd={addSkill}
              />
              <div className="p-4 space-y-4">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Skill name (e.g., React)"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="w-32">
                        <Slider
                          value={[skill.proficiency]}
                          onValueChange={(value) => updateSkill(skill.id, { proficiency: value[0] })}
                          max={100}
                          step={10}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{skill.proficiency}%</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {resumeData.skills.length === 0 && (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No skills added yet. Click "+ Add" above to add your skills.
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Custom Sections */}
            {resumeData.customSections.map((section) => (
              <div key={section.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg gradient-bg text-primary-foreground">
                      <List className="w-4 h-4" />
                    </div>
                    <Input
                      value={section.title}
                      onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                      className="font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[200px]"
                      placeholder="Section Title"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => addCustomSectionItem(section.id)}
                      className="gap-1 gradient-bg"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeCustomSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Enter content..."
                          value={item.content}
                          onChange={(e) => updateCustomSectionItem(section.id, item.id, e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeCustomSectionItem(section.id, item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {section.items.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        No items added yet.
                      </p>
                      <Button 
                        onClick={() => addCustomSectionItem(section.id)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Custom Section */}
            <div className="bg-card border border-dashed border-border rounded-xl p-4">
              {showAddSection ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <PlusCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Enter section title (e.g., Languages, Certifications, Hobbies)"
                      className="flex-1"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddSection(false);
                        setNewSectionTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="gradient-bg"
                      onClick={() => {
                        if (newSectionTitle.trim()) {
                          addCustomSection(newSectionTitle.trim());
                          setNewSectionTitle('');
                          setShowAddSection(false);
                        }
                      }}
                      disabled={!newSectionTitle.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full h-auto py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAddSection(true)}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add Custom Section</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-muted/30 overflow-y-auto p-8">
          <div className="max-w-[800px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <span className="text-sm text-muted-foreground capitalize">
                {templateOptions.find(t => t.id === selectedTemplate)?.name || 'Cosmos'} Template
              </span>
            </div>
            
            {/* Resume Preview */}
            <div 
              ref={resumeRef}
              className="bg-white text-gray-900 shadow-2xl aspect-[8.5/11] font-resume overflow-hidden"
            >
              {selectedTemplate === 'cosmos' && <CosmosTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'celestial' && <CelestialTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'galaxy' && <GalaxyTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'aurora' && <AuroraTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'lunar' && <LunarTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'eclipse' && <EclipseTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'nebula' && <NebulaTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'stellar' && <StellarTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'orbit' && <OrbitTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'executive' && <ExecutiveTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'modern' && <ModernTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'classic' && <ClassicTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'minimalist' && <MinimalistTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'creative' && <CreativeTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'professional' && <ProfessionalTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'nova' && <NovaTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'eon' && <EonTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'solstice' && <SolsticeTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'zenith' && <ZenithTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'apex' && <ApexTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'horizon' && <HorizonTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'pinnacle' && <PinnacleTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
              {selectedTemplate === 'vertex' && <VertexTemplate data={resumeData} accentColor={colorOptions.find(c => c.id === selectedColor)!} isMonochrome={isMonochrome} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Template Props Type
interface TemplateProps {
  data: any;
  accentColor: { id: string; name: string; primary: string; secondary: string };
  isMonochrome: boolean;
}

// Cosmos Template - Clean two-column with left sidebar (like Kelly)
const CosmosTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  const secondary = isMonochrome ? '#f1f5f9' : accentColor.secondary;
  
  return (
  <div className="h-full flex text-[11px]">
    {/* Left Sidebar */}
    <div className="w-[35%] p-6" style={{ backgroundColor: secondary }}>
      <h1 className="font-bold text-xl leading-tight" style={{ color: primary }}>
        {data.personalInfo.fullName || 'Your Name'}
      </h1>
      <p className="text-slate-600 text-sm mb-6">
        {data.experience[0]?.position || 'Professional'}
      </p>
      
      <div className="mb-6">
        <h4 className="font-bold text-sm border-b pb-2 mb-3" style={{ color: primary, borderColor: primary }}>DETAILS</h4>
        <div className="space-y-2 text-slate-600">
          {data.personalInfo.email && (
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: primary }} />
              <span className="break-all">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: primary }} />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-start gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span className="break-all">{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>
      
      {data.skills.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-slate-700 border-b border-slate-300 pb-2 mb-3">SKILLS</h4>
          <ul className="space-y-1 text-slate-600">
            {data.skills.map((skill: any) => (
              <li key={skill.id}>• {skill.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
    {/* Main Content */}
    <div className="flex-1 p-6">
      {data.personalInfo.summary && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">SUMMARY</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">EXPERIENCE</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{exp.position}</p>
                <p className="text-slate-500 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
              </div>
              <p className="text-blue-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.description && (
                <ul className="text-slate-600 mt-1 space-y-0.5">
                  {exp.description.split('\n').map((line: string, i: number) => (
                    <li key={i}>• {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      {data.education.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">EDUCATION</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
              <p className="text-slate-500">{edu.school} • {edu.startDate} — {edu.endDate}</p>
              {edu.gpa && <p className="text-slate-500">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">PROJECTS</h4>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-2">
              <p className="font-semibold">{proj.name}</p>
              {proj.technologies && <p className="text-slate-500 text-[10px]">{proj.technologies}</p>}
              {proj.description && <p className="text-slate-600 mt-1">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">ACHIEVEMENTS</h4>
          {data.achievements.map((ach: any) => (
            <div key={ach.id} className="mb-2">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{ach.title}</p>
                {ach.date && <p className="text-slate-500 text-[10px]">{ach.date}</p>}
              </div>
              {ach.description && <p className="text-slate-600">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.customSections?.map((section: any) => (
        section.items.length > 0 && (
          <div key={section.id} className="mb-5">
            <h4 className="font-bold text-sm border-b pb-2 mb-2" style={{ color: primary, borderColor: primary }}>{section.title.toUpperCase()}</h4>
            <ul className="text-slate-600 space-y-1">
              {section.items.map((item: any) => (
                <li key={item.id}>• {item.content}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  </div>
  );
};

// Celestial Template - Centered single-column (like Howard)
const CelestialTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  // Debug log
  console.log('Celestial Template Data:', { achievements: data.achievements, projects: data.projects });
  
  return (
  <div className="h-full text-[11px] p-8">
    {/* Header */}
    <div className="text-center pb-4 mb-6" style={{ borderBottom: `2px solid ${primary}` }}>
      <h1 className="font-bold text-2xl tracking-wide uppercase" style={{ color: primary }}>
        {data.personalInfo.fullName || 'Your Name'}
      </h1>
      <p className="text-slate-600 text-sm mt-1">{data.experience[0]?.position || 'Professional'}</p>
      <p className="text-slate-500 mt-2">
        {[data.personalInfo.location, data.personalInfo.email, data.personalInfo.phone]
          .filter(Boolean).join(' | ')}
      </p>
    </div>
    
    {data.personalInfo.summary && (
      <div className="mb-5">
        <h4 className="font-bold text-sm text-slate-700 text-center border-b border-slate-200 pb-2 mb-2">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed text-center">{data.personalInfo.summary}</p>
      </div>
    )}
    
    {data.experience.length > 0 && (
      <div className="mb-5">
        <h4 className="font-bold text-sm text-slate-700 text-center border-b border-slate-200 pb-2 mb-3">EXPERIENCE</h4>
        {data.experience.map((exp: any) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between">
              <p className="font-semibold">{exp.position}, {exp.company}</p>
              <p className="text-slate-500">{exp.startDate} — {exp.endDate || 'Present'}</p>
            </div>
            {exp.description && (
              <ul className="text-slate-600 mt-1 space-y-0.5">
                {exp.description.split('\n').map((line: string, i: number) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )}
    
    <div className="grid grid-cols-2 gap-6">
      {data.education.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-slate-700 border-b border-slate-200 pb-2 mb-2">EDUCATION</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold">{edu.school}</p>
              <p className="text-slate-500">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
              <p className="text-slate-500 text-[10px]">{edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-slate-700 border-b border-slate-200 pb-2 mb-2">SKILLS</h4>
          <p className="text-slate-600">{data.skills.map((s: any) => s.name).join(' • ')}</p>
        </div>
      )}
    </div>

    {data.projects.length > 0 && (
      <div className="mt-5">
        <h4 className="font-bold text-sm text-slate-700 text-center border-b border-slate-200 pb-2 mb-3">PROJECTS</h4>
        {data.projects.map((proj: any) => (
          <div key={proj.id} className="mb-3">
            <div className="flex justify-between">
              <p className="font-semibold">{proj.name}</p>
              {proj.link && <a href={proj.link} className="text-blue-500 text-[10px]">{proj.link}</a>}
            </div>
            {proj.technologies && <p className="text-slate-400 text-[10px]">{proj.technologies}</p>}
            {proj.description && <p className="text-slate-600 mt-1">{proj.description}</p>}
          </div>
        ))}
      </div>
    )}

    {data.achievements.length > 0 && (
      <div className="mt-5">
        <h4 className="font-bold text-sm text-slate-700 text-center border-b border-slate-200 pb-2 mb-3">ACHIEVEMENTS</h4>
        {data.achievements.map((ach: any) => (
          <div key={ach.id} className="mb-2">
            <div className="flex justify-between">
              <p className="font-semibold">{ach.title}</p>
              {ach.date && <p className="text-slate-500 text-[10px]">{ach.date}</p>}
            </div>
            {ach.description && <p className="text-slate-600">{ach.description}</p>}
          </div>
        ))}
      </div>
    )}

    {data.customSections?.map((section: any) => (
      section.items.length > 0 && (
        <div key={section.id} className="mt-5">
          <h4 className="font-bold text-sm text-center border-b pb-2 mb-2" style={{ color: primary, borderColor: primary }}>{section.title.toUpperCase()}</h4>
          <ul className="text-slate-600 space-y-1">
            {section.items.map((item: any) => (
              <li key={item.id}>• {item.content}</li>
            ))}
          </ul>
        </div>
      )
    ))}
  </div>
  );
};

// Galaxy Template - Modern with photo sidebar (like Samantha)
const GalaxyTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
  <div className="h-full flex text-[11px]">
    {/* Colored Sidebar */}
    <div className="w-[32%] text-white p-5" style={{ background: `linear-gradient(to bottom, ${primary}, ${primary}dd)` }}>
      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-3 border-white overflow-hidden" style={{ backgroundColor: data.personalInfo.profilePhoto ? 'transparent' : `${primary}66` }}>
        {data.personalInfo.profilePhoto ? (
          <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-lg">
            {data.personalInfo.fullName?.split(' ').map((n: string) => n[0]).join('') || 'NA'}
          </span>
        )}
      </div>
      <h3 className="text-center font-bold text-lg mb-0.5">{data.personalInfo.fullName || 'Your Name'}</h3>
      <p className="text-center opacity-80 text-sm mb-4">{data.experience[0]?.position || 'Professional'}</p>
      
      <div className="space-y-2 mb-5">
        {data.personalInfo.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{data.personalInfo.location}</span>
          </div>
        )}
        {data.personalInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span className="truncate">{data.personalInfo.email}</span>
          </div>
        )}
        {data.personalInfo.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{data.personalInfo.phone}</span>
          </div>
        )}
      </div>
      
      {data.skills.length > 0 && (
        <div>
          <h4 className="font-bold text-sm border-b border-blue-400 pb-2 mb-3">SKILLS</h4>
          <ul className="space-y-1">
            {data.skills.map((skill: any) => (
              <li key={skill.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
    {/* Main Content */}
    <div className="flex-1 p-5">
      {data.personalInfo.summary && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">SUMMARY</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">EXPERIENCE</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{exp.position}</p>
                <p className="text-slate-500 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
              </div>
              <p className="text-blue-600">{exp.company}{exp.location && ` - ${exp.location}`}</p>
              {exp.description && (
                <ul className="text-slate-600 mt-1 space-y-0.5">
                  {exp.description.split('\n').map((line: string, i: number) => (
                    <li key={i}>• {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      {data.education.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">EDUCATION</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold">{edu.school}</p>
              <p className="text-slate-500">{edu.degree}{edu.field && ` in ${edu.field}`} • {edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {data.customSections?.map((section: any) => (
        section.items.length > 0 && (
          <div key={section.id} className="mt-5">
            <h4 className="font-bold text-sm text-slate-800 border-b border-slate-300 pb-2 mb-2">{section.title.toUpperCase()}</h4>
            <ul className="text-slate-600 space-y-1">
              {section.items.map((item: any) => (
                <li key={item.id}>• {item.content}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  </div>
  );
};

// Aurora Template - Modern gradient header (like Jessie)
const AuroraTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
  <div className="h-full text-[11px]">
    {/* Gradient Header */}
    <div className="text-white p-6" style={{ background: `linear-gradient(to right, ${primary}, ${primary}cc)` }}>
      <h1 className="font-bold text-xl">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="opacity-80 text-sm">{data.experience[0]?.position || 'Professional'}</p>
      <p className="opacity-80 mt-2">
        {[data.personalInfo.location, data.personalInfo.email, data.personalInfo.phone]
          .filter(Boolean).join(' | ')}
      </p>
    </div>
    
    <div className="p-6">
      {data.personalInfo.summary && (
        <div className="mb-5">
          <h4 className="font-bold text-sm pb-2 mb-2" style={{ color: primary, borderBottom: `1px solid ${primary}33` }}>SUMMARY</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm pb-2 mb-2" style={{ color: primary, borderBottom: `1px solid ${primary}33` }}>EXPERIENCE</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <p className="font-semibold">{exp.position}</p>
                <p className="text-slate-500">{exp.startDate} — {exp.endDate || 'Present'}</p>
              </div>
              <p className="text-violet-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.description && (
                <ul className="text-slate-600 mt-1 space-y-0.5">
                  {exp.description.split('\n').map((line: string, i: number) => (
                    <li key={i}>• {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-violet-600 border-b border-violet-200 pb-2 mb-2">EDUCATION</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                <p className="text-slate-500">{edu.school} • {edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-violet-600 border-b border-violet-200 pb-2 mb-2">SKILLS</h4>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill: any) => (
                <span key={skill.id} className="bg-violet-50 text-violet-600 px-2 py-1 rounded text-[10px]">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.customSections?.map((section: any) => (
        section.items.length > 0 && (
          <div key={section.id} className="mt-5">
            <h4 className="font-bold text-sm text-violet-600 border-b border-violet-200 pb-2 mb-2">{section.title.toUpperCase()}</h4>
            <ul className="text-slate-600 space-y-1">
              {section.items.map((item: any) => (
                <li key={item.id}>• {item.content}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  </div>
  );
};

// Lunar Template - Two-column with right sidebar (like Wes)
const LunarTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  const secondary = isMonochrome ? '#f1f5f9' : accentColor.secondary;
  
  return (
  <div className="h-full flex text-[11px]">
    {/* Main Content */}
    <div className="flex-1 p-6">
      <h1 className="font-bold text-xl text-slate-900 uppercase">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-sm font-medium mb-4" style={{ color: primary }}>{data.experience[0]?.position?.toUpperCase() || 'PROFESSIONAL'}</p>
      
      {data.personalInfo.summary && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 px-2 py-1 mb-2" style={{ backgroundColor: secondary }}>SUMMARY</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-slate-800 px-2 py-1 mb-2" style={{ backgroundColor: secondary }}>EXPERIENCE</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-4">
              <p className="font-semibold">{exp.position}, {exp.company}</p>
              <p className="text-slate-500">{exp.location} • {exp.startDate} — {exp.endDate || 'Present'}</p>
              {exp.description && (
                <ul className="text-slate-600 mt-1 space-y-0.5">
                  {exp.description.split('\n').map((line: string, i: number) => (
                    <li key={i}>• {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      {data.education.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-slate-800 px-2 py-1 mb-2" style={{ backgroundColor: secondary }}>EDUCATION</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold">{edu.school}</p>
              <p className="text-slate-500">{edu.degree}{edu.field && ` in ${edu.field}`} • {edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {data.customSections?.map((section: any) => (
        section.items.length > 0 && (
          <div key={section.id} className="mt-5">
            <h4 className="font-bold text-sm text-slate-800 px-2 py-1 mb-2" style={{ backgroundColor: secondary }}>{section.title.toUpperCase()}</h4>
            <ul className="text-slate-600 space-y-1">
              {section.items.map((item: any) => (
                <li key={item.id}>• {item.content}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
    
    {/* Right Sidebar */}
    <div className="w-[28%] bg-amber-50 p-4">
      <h4 className="font-bold text-sm text-amber-800 mb-3">DETAILS</h4>
      <div className="space-y-2 text-slate-600 mb-5">
        {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
        {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
        {data.personalInfo.email && <p className="break-all">{data.personalInfo.email}</p>}
      </div>
      
      {data.skills.length > 0 && (
        <>
          <h4 className="font-bold text-sm text-amber-800 mb-3">SKILLS</h4>
          <ul className="space-y-1 text-slate-600">
            {data.skills.map((skill: any) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  </div>
  );
};

// Eclipse Template - Entry-level with photo (like Sebastian)
const EclipseTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
  <div className="h-full flex text-[11px]">
    {/* Colored Sidebar */}
    <div className="w-[30%] text-white p-5" style={{ background: `linear-gradient(to bottom, ${primary}, ${primary}dd)` }}>
      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white overflow-hidden" style={{ backgroundColor: data.personalInfo.profilePhoto ? 'transparent' : 'rgba(255,255,255,0.2)' }}>
        {data.personalInfo.profilePhoto ? (
          <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-bold">
            {data.personalInfo.fullName?.split(' ').map((n: string) => n[0]).join('') || 'NA'}
          </span>
        )}
      </div>
      
      <h4 className="font-bold text-sm mt-4 mb-3">DETAILS</h4>
      <div className="space-y-2">
        {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
        {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
        {data.personalInfo.email && <p className="break-all">{data.personalInfo.email}</p>}
      </div>
      
      {data.skills.length > 0 && (
        <>
          <h4 className="font-bold text-sm mt-5 mb-3">SKILLS</h4>
          <ul className="space-y-1">
            {data.skills.map((skill: any) => (
              <li key={skill.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                {skill.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
    
    {/* Main Content */}
    <div className="flex-1 p-6">
      <h1 className="font-bold text-xl text-slate-900">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-sm font-medium mb-4" style={{ color: primary }}>{data.experience[0]?.position || 'Professional'}</p>
      
      {data.personalInfo.summary && (
        <div className="mb-5">
          <h4 className="font-bold text-sm pb-2 mb-2" style={{ color: primary, borderBottom: `1px solid ${primary}33` }}>SUMMARY</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-cyan-600 border-b border-cyan-200 pb-2 mb-2">EXPERIENCE</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <p className="font-semibold">{exp.position}</p>
              <p className="text-slate-500">{exp.company} • {exp.startDate} — {exp.endDate || 'Present'}</p>
              {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {data.education.length > 0 && (
        <div>
          <h4 className="font-bold text-sm text-cyan-600 border-b border-cyan-200 pb-2 mb-2">EDUCATION</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold">{edu.degree}{edu.field && `, ${edu.field}`}</p>
              <p className="text-slate-500">{edu.school} • {edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-cyan-600 border-b border-cyan-200 pb-2 mb-2">PROJECTS</h4>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-3">
              <p className="font-semibold">{proj.name}</p>
              {proj.technologies && <p className="text-slate-400 text-[10px]">{proj.technologies}</p>}
              {proj.description && <p className="text-slate-600 mt-1">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.achievements.length > 0 && (
        <div className="mb-5">
          <h4 className="font-bold text-sm text-cyan-600 border-b border-cyan-200 pb-2 mb-2">ACHIEVEMENTS</h4>
          {data.achievements.map((ach: any) => (
            <div key={ach.id} className="mb-2">
              <p className="font-semibold">{ach.title} {ach.date && <span className="text-slate-400 font-normal">• {ach.date}</span>}</p>
              {ach.description && <p className="text-slate-600">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.customSections?.map((section: any) => (
        section.items.length > 0 && (
          <div key={section.id} className="mt-5">
            <h4 className="font-bold text-sm mb-2" style={{ color: primary }}>{section.title.toUpperCase()}</h4>
            <ul className="text-slate-600 space-y-1">
              {section.items.map((item: any) => (
                <li key={item.id}>• {item.content}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  </div>
  );
};

// Nebula Template - Modern clean with accent line
const NebulaTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
  <div className="h-full text-[11px] p-6">
    {/* Header with accent */}
    <div className="pl-4 mb-6" style={{ borderLeft: `4px solid ${primary}` }}>
      <h1 className="font-bold text-2xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="font-medium" style={{ color: primary }}>{data.experience[0]?.position || 'Professional Title'}</p>
      <div className="flex flex-wrap gap-4 mt-2 text-slate-500 text-[10px]">
        {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>☎ {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
      </div>
    </div>

    {data.personalInfo.summary && (
      <div className="mb-5">
        <p className="text-slate-600 leading-relaxed italic border-l-2 border-indigo-200 pl-3">
          {data.personalInfo.summary}
        </p>
      </div>
    )}

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        {data.experience.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              EXPERIENCE
            </h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-indigo-300 before:rounded-full">
                <div className="flex justify-between">
                  <p className="font-semibold">{exp.position}</p>
                  <p className="text-slate-400 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
                </div>
                <p className="text-indigo-500">{exp.company}</p>
                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              PROJECTS
            </h4>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="mb-3 pl-4">
                <p className="font-semibold">{proj.name}</p>
                {proj.technologies && <p className="text-indigo-400 text-[10px]">{proj.technologies}</p>}
                {proj.description && <p className="text-slate-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">
        {data.education.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-indigo-600 mb-3">EDUCATION</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-[10px]">{edu.degree}</p>
                <p className="text-slate-500 text-[10px]">{edu.school}</p>
                <p className="text-slate-400 text-[9px]">{edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-indigo-600 mb-3">SKILLS</h4>
            <div className="space-y-2">
              {data.skills.map((skill: any) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>{skill.name}</span>
                    <span className="text-slate-400">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.achievements.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-indigo-600 mb-3">ACHIEVEMENTS</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-2">
                <p className="font-semibold text-[10px]">{ach.title}</p>
                <p className="text-slate-500 text-[9px]">{ach.date}</p>
              </div>
            ))}
          </div>
        )}

        {data.customSections?.map((section: any) => (
          section.items.length > 0 && (
            <div key={section.id}>
              <h4 className="font-bold text-sm mb-3" style={{ color: primary }}>{section.title.toUpperCase()}</h4>
              <ul className="text-slate-600 space-y-1 text-[10px]">
                {section.items.map((item: any) => (
                  <li key={item.id}>• {item.content}</li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  </div>
  );
};

// Stellar Template - Minimal elegant
const StellarTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
  <div className="h-full text-[11px] p-8 bg-white">
    {/* Minimal Header */}
    <div className="text-center mb-8">
      <h1 className="font-light text-3xl text-slate-800 tracking-wide">{data.personalInfo.fullName || 'Your Name'}</h1>
      <div className="w-16 h-0.5 mx-auto my-3" style={{ backgroundColor: primary }}></div>
      <p className="text-slate-500 text-sm">{data.experience[0]?.position || 'Professional'}</p>
      <div className="flex justify-center gap-6 mt-3 text-slate-400 text-[10px]">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
      </div>
    </div>

    {data.personalInfo.summary && (
      <div className="mb-6 text-center max-w-lg mx-auto">
        <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
      </div>
    )}

    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        {data.experience.length > 0 && (
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-4">
                <p className="font-medium">{exp.position}</p>
                <p className="text-slate-500">{exp.company} · {exp.startDate} — {exp.endDate || 'Present'}</p>
                {exp.description && <p className="text-slate-600 mt-1 text-[10px]">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">Projects</h4>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="mb-3">
                <p className="font-medium">{proj.name}</p>
                {proj.technologies && <p className="text-slate-400 text-[10px]">{proj.technologies}</p>}
                {proj.description && <p className="text-slate-600 text-[10px]">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {data.education.length > 0 && (
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">Education</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-3">
                <p className="font-medium">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                <p className="text-slate-500">{edu.school}</p>
                <p className="text-slate-400 text-[10px]">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any) => (
                <span key={skill.id} className="border border-slate-200 px-3 py-1 rounded-full text-[10px]">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.achievements.length > 0 && (
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">Achievements</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-2">
                <p className="font-medium text-[10px]">{ach.title}</p>
                {ach.description && <p className="text-slate-500 text-[9px]">{ach.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.customSections?.map((section: any) => (
          section.items.length > 0 && (
            <div key={section.id}>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-400 mb-4">{section.title}</h4>
              <ul className="text-slate-600 space-y-1 text-[10px]">
                {section.items.map((item: any) => (
                  <li key={item.id}>• {item.content}</li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  </div>
  );
};

// Orbit Template - Creative with timeline
const OrbitTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  const secondary = isMonochrome ? '#f1f5f9' : accentColor.secondary;
  
  return (
  <div className="h-full text-[11px]" style={{ background: `linear-gradient(to bottom right, ${secondary}, white)` }}>
    {/* Creative Header */}
    <div className="text-white p-6" style={{ background: `linear-gradient(to right, ${primary}, ${primary}cc)` }}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border-2 border-white/50">
          {data.personalInfo.fullName?.split(' ').map((n: string) => n[0]).join('') || 'NA'}
        </div>
        <div>
          <h1 className="font-bold text-xl">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="opacity-80">{data.experience[0]?.position || 'Professional'}</p>
        </div>
      </div>
      <div className="flex gap-4 mt-4 opacity-80 text-[10px]">
        {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>☎ {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
      </div>
    </div>

    <div className="p-6">
      {data.personalInfo.summary && (
        <div className="mb-5 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {data.experience.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm text-rose-600 mb-3">💼 Experience</h4>
              <div className="border-l-2 border-rose-200 pl-4 space-y-4">
                {data.experience.map((exp: any) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 bg-rose-400 rounded-full"></div>
                    <p className="font-semibold">{exp.position}</p>
                    <p className="text-rose-500">{exp.company}</p>
                    <p className="text-slate-400 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
                    {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm text-rose-600 mb-3">🚀 Projects</h4>
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="mb-3">
                  <p className="font-semibold">{proj.name}</p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 my-1">
                      {proj.technologies.split(',').map((tech: string, i: number) => (
                        <span key={i} className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[9px]">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="text-slate-600 text-[10px]">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {data.education.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm text-rose-600 mb-3">🎓 Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-[10px]">{edu.degree}</p>
                  <p className="text-slate-500 text-[10px]">{edu.school}</p>
                  <p className="text-slate-400 text-[9px]">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm text-rose-600 mb-3">⚡ Skills</h4>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill: any) => (
                  <span key={skill.id} className="px-2 py-1 rounded-full text-[10px]" style={{ backgroundColor: secondary, color: primary }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.achievements.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-sm mb-3" style={{ color: primary }}>🏆 Achievements</h4>
              {data.achievements.map((ach: any) => (
                <div key={ach.id} className="mb-2">
                  <p className="font-semibold text-[10px]">{ach.title}</p>
                  <p className="text-slate-400 text-[9px]">{ach.date}</p>
                </div>
              ))}
            </div>
          )}

          {data.customSections?.map((section: any) => (
            section.items.length > 0 && (
              <div key={section.id} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-sm mb-3" style={{ color: primary }}>📝 {section.title}</h4>
                <ul className="text-slate-600 space-y-1 text-[10px]">
                  {section.items.map((item: any) => (
                    <li key={item.id}>• {item.content}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

// Executive Template - Corporate style with bold header
const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1e293b' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] bg-white">
      {/* Bold Header */}
      <div className="p-6 text-white" style={{ backgroundColor: primary }}>
        <h1 className="font-bold text-2xl tracking-wide">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg opacity-90 mt-1">{data.experience[0]?.position || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-80">
          {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>📞 {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="p-6">
        {data.personalInfo.summary && (
          <div className="mb-5">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: primary }}>Executive Summary</h4>
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-5">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: primary }}>Professional Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-4 pl-3 border-l-2" style={{ borderColor: primary }}>
                <div className="flex justify-between">
                  <p className="font-bold">{exp.position}</p>
                  <p className="text-slate-500">{exp.startDate} — {exp.endDate || 'Present'}</p>
                </div>
                <p className="text-slate-700 font-medium">{exp.company}</p>
                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6">
          {data.education.length > 0 && (
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                  <p className="text-slate-500">{edu.school} • {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: primary }}>Core Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: any) => (
                  <span key={skill.id} className="px-2 py-1 text-[10px] rounded" style={{ backgroundColor: `${primary}15`, color: primary }}>{skill.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {data.achievements.length > 0 && (
          <div className="mt-5">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: primary }}>Key Achievements</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-2 flex items-start gap-2">
                <span style={{ color: primary }}>★</span>
                <div>
                  <span className="font-semibold">{ach.title}</span>
                  {ach.description && <span className="text-slate-600"> - {ach.description}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Modern Template - Two-column with timeline
const ModernTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#374151' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] flex">
      {/* Left Column - 40% */}
      <div className="w-[40%] bg-slate-50 p-5">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: primary }}>
            {data.personalInfo.fullName?.split(' ').map((n: string) => n[0]).join('') || 'NA'}
          </div>
          <h1 className="font-bold text-lg">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-slate-500">{data.experience[0]?.position || 'Professional'}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Contact</h4>
            <div className="space-y-1 text-slate-600">
              {data.personalInfo.email && <p>📧 {data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>📱 {data.personalInfo.phone}</p>}
              {data.personalInfo.location && <p>📍 {data.personalInfo.location}</p>}
            </div>
          </div>
          
          {data.skills.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Skills</h4>
              {data.skills.map((skill: any) => (
                <div key={skill.id} className="mb-2">
                  <p className="text-slate-700">{skill.name}</p>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${skill.proficiency || 80}%`, backgroundColor: primary }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {data.education.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-[10px]">{edu.degree}</p>
                  <p className="text-slate-500 text-[10px]">{edu.school}</p>
                  <p className="text-slate-400 text-[9px]">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Column - 60% */}
      <div className="flex-1 p-5">
        {data.personalInfo.summary && (
          <div className="mb-5">
            <h4 className="font-bold text-sm mb-2" style={{ color: primary }}>About Me</h4>
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-5">
            <h4 className="font-bold text-sm mb-3" style={{ color: primary }}>Work Experience</h4>
            {data.experience.map((exp: any, idx: number) => (
              <div key={exp.id} className="relative pl-4 pb-4 border-l-2 border-slate-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full" style={{ backgroundColor: primary }}></div>
                <p className="font-bold">{exp.position}</p>
                <p className="text-slate-500 text-[10px]">{exp.company} | {exp.startDate} - {exp.endDate || 'Present'}</p>
                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        {data.projects.length > 0 && (
          <div className="mb-5">
            <h4 className="font-bold text-sm mb-2" style={{ color: primary }}>Projects</h4>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="mb-2">
                <p className="font-semibold">{proj.name}</p>
                {proj.technologies && <p className="text-slate-400 text-[10px]">{proj.technologies}</p>}
                {proj.description && <p className="text-slate-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        {data.achievements.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-2" style={{ color: primary }}>Achievements</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-1 flex items-start gap-2">
                <span style={{ color: primary }}>•</span>
                <span>{ach.title}{ach.date && ` (${ach.date})`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Classic Template - Traditional single-column
const ClassicTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1f2937' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] p-6">
      {/* Header */}
      <div className="text-center border-b-2 pb-4 mb-4" style={{ borderColor: primary }}>
        <h1 className="font-serif font-bold text-2xl" style={{ color: primary }}>{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex justify-center gap-4 mt-2 text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
      </div>
      
      {data.personalInfo.summary && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Professional Summary</h4>
          <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Experience</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold">{exp.position}</p>
                <p className="text-slate-500 italic">{exp.startDate} - {exp.endDate || 'Present'}</p>
              </div>
              <p className="text-slate-600 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {data.education.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Education</h4>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-2 flex justify-between">
              <div>
                <p className="font-bold">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                <p className="text-slate-600 italic">{edu.school}</p>
              </div>
              <p className="text-slate-500 italic">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
      
      {data.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Skills</h4>
          <p className="text-slate-700">{data.skills.map((s: any) => s.name).join(' • ')}</p>
        </div>
      )}
      
      {data.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Achievements</h4>
          {data.achievements.map((ach: any) => (
            <div key={ach.id} className="mb-1">
              <span className="font-semibold">{ach.title}</span>
              {ach.date && <span className="text-slate-500"> ({ach.date})</span>}
              {ach.description && <span className="text-slate-600"> - {ach.description}</span>}
            </div>
          ))}
        </div>
      )}
      
      {data.projects.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase border-b mb-2 pb-1" style={{ color: primary, borderColor: `${primary}33` }}>Projects</h4>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-2">
              <p className="font-semibold">{proj.name}</p>
              {proj.description && <p className="text-slate-600">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Minimalist Template - Ultra clean and simple
const MinimalistTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#18181b' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] p-8 font-light">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-light text-3xl tracking-tight text-slate-900">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-slate-500 mt-1">{data.experience[0]?.position || 'Professional'}</p>
        <div className="flex gap-6 mt-3 text-slate-400 text-[10px]">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      {data.personalInfo.summary && (
        <div className="mb-6">
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      <div className="border-t border-slate-100 pt-4">
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium text-slate-800">{exp.position}</p>
                  <p className="text-slate-400 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
                </div>
                <p className="text-slate-500">{exp.company}</p>
                {exp.description && <p className="text-slate-500 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-medium text-slate-800">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
          
          {data.skills.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Skills</h4>
              <p className="text-slate-600">{data.skills.map((s: any) => s.name).join(', ')}</p>
            </div>
          )}
        </div>
        
        {data.achievements.length > 0 && (
          <div className="mt-6">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Achievements</h4>
            {data.achievements.map((ach: any) => (
              <p key={ach.id} className="text-slate-600 mb-1">{ach.title}{ach.description && ` — ${ach.description}`}</p>
            ))}
          </div>
        )}
        
        {data.projects.length > 0 && (
          <div className="mt-6">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Projects</h4>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="mb-2">
                <p className="font-medium text-slate-800">{proj.name}</p>
                {proj.description && <p className="text-slate-500">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Creative Template - Bold colors and unique layout
const CreativeTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#334155' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px]">
      {/* Creative Header with diagonal */}
      <div className="relative h-32 overflow-hidden" style={{ backgroundColor: primary }}>
        <div className="absolute inset-0 flex items-center px-6">
          <div className="text-white">
            <h1 className="font-black text-2xl tracking-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-lg opacity-90">{data.experience[0]?.position || 'Creative Professional'}</p>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full" style={{ backgroundColor: `${primary}66` }}></div>
      </div>
      
      {/* Contact Bar */}
      <div className="flex justify-center gap-6 py-2 bg-slate-100 text-slate-600 text-[10px]">
        {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
      </div>
      
      <div className="p-5">
        {data.personalInfo.summary && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${primary}10` }}>
            <p className="text-slate-700 leading-relaxed italic">"{data.personalInfo.summary}"</p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-4">
            {data.experience.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: primary }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primary }}>💼</span>
                  Experience
                </h4>
                {data.experience.map((exp: any) => (
                  <div key={exp.id} className="mb-3 pl-8">
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-slate-500">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                    {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {data.projects.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: primary }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primary }}>🚀</span>
                  Projects
                </h4>
                {data.projects.map((proj: any) => (
                  <div key={proj.id} className="mb-2 pl-8">
                    <p className="font-semibold">{proj.name}</p>
                    {proj.description && <p className="text-slate-600">{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="space-y-4">
            {data.skills.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-50">
                <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill: any) => (
                    <span key={skill.id} className="px-2 py-0.5 text-[9px] rounded-full text-white" style={{ backgroundColor: primary }}>{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {data.education.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-50">
                <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Education</h4>
                {data.education.map((edu: any) => (
                  <div key={edu.id} className="mb-2 text-[10px]">
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-slate-500">{edu.school}</p>
                  </div>
                ))}
              </div>
            )}
            
            {data.achievements.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-50">
                <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Achievements</h4>
                {data.achievements.map((ach: any) => (
                  <p key={ach.id} className="text-[10px] text-slate-600 mb-1">🏆 {ach.title}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Template - Clean corporate style
const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1e3a5f' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px]">
      {/* Header with line accent */}
      <div className="p-6 border-b-4" style={{ borderColor: primary }}>
        <h1 className="font-bold text-2xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-slate-600 text-sm mt-1">{data.experience[0]?.position || 'Professional'}</p>
        <div className="flex gap-4 mt-2 text-slate-500 text-[10px]">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>| {data.personalInfo.linkedin}</span>}
        </div>
      </div>
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-5">
          {data.personalInfo.summary && (
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primary, borderColor: primary }}>Profile</h4>
              <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}
          
          {data.experience.length > 0 && (
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: primary, borderColor: primary }}>Professional Experience</h4>
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{exp.position}</p>
                      <p style={{ color: primary }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <p className="text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate || 'Present'}</p>
                  </div>
                  {exp.description && <p className="text-slate-600 mt-2">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          
          {data.projects.length > 0 && (
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primary, borderColor: primary }}>Key Projects</h4>
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="mb-2">
                  <p className="font-semibold">{proj.name} {proj.technologies && <span className="font-normal text-slate-400">({proj.technologies})</span>}</p>
                  {proj.description && <p className="text-slate-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <div className="w-[35%] p-5 bg-slate-50">
          {data.education.length > 0 && (
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-3">
                  <p className="font-semibold text-slate-800">{edu.degree}</p>
                  {edu.field && <p className="text-slate-600">{edu.field}</p>}
                  <p className="text-slate-500">{edu.school}</p>
                  <p className="text-slate-400 text-[10px]">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          
          {data.skills.length > 0 && (
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Technical Skills</h4>
              <ul className="space-y-1">
                {data.skills.map((skill: any) => (
                  <li key={skill.id} className="flex items-center gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }}></span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.achievements.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Achievements</h4>
              {data.achievements.map((ach: any) => (
                <div key={ach.id} className="mb-2">
                  <p className="font-semibold text-slate-700">{ach.title}</p>
                  {ach.date && <p className="text-slate-400 text-[10px]">{ach.date}</p>}
                  {ach.description && <p className="text-slate-500">{ach.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Nova Template - ATS-optimized two-column (like Travis Willis)
const NovaTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1e3a5f' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] bg-white">
      {/* Header */}
      <div className="text-center py-4 border-b-2" style={{ borderColor: primary }}>
        <h1 className="font-bold text-2xl uppercase tracking-wider text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-slate-600 mt-1">{data.experience[0]?.position || 'Professional Title'}</p>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-500">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="flex p-4">
        {/* Left - Skills & Education */}
        <div className="w-[30%] pr-4 border-r border-slate-200">
          {data.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Skills</h4>
              <div className="grid grid-cols-2 gap-1">
                {data.skills.map((skill: any) => (
                  <span key={skill.id} className="text-slate-600">{skill.name}</span>
                ))}
              </div>
            </div>
          )}
          
          {data.education.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-[10px]">{edu.school}</p>
                  <p className="text-slate-600 text-[10px]">{edu.degree}</p>
                  <p className="text-slate-500 text-[9px]">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right - Main Content */}
        <div className="flex-1 pl-4">
          {data.personalInfo.summary && (
            <div className="mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Summary</h4>
              <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}
          
          {data.experience.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Experience</h4>
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-800">{exp.position}</p>
                    <p className="text-slate-500 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
                  </div>
                  <p className="text-slate-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5 text-slate-600">
                      {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                        <li key={i}>• {line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {data.projects.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Projects</h4>
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="mb-2">
                  <p className="font-semibold">{proj.name}</p>
                  {proj.description && <p className="text-slate-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
          
          {data.achievements.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: primary }}>Achievements</h4>
              {data.achievements.map((ach: any) => (
                <p key={ach.id} className="text-slate-600 mb-1">• {ach.title}{ach.description && ` - ${ach.description}`}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Eon Template - ATS with right sidebar (like Matthew Jones)
const EonTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#374151' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] flex bg-white">
      {/* Main Content - Left */}
      <div className="flex-1 p-5">
        {/* Name Header */}
        <div className="mb-4">
          <h1 className="font-bold text-xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm" style={{ color: primary }}>{data.experience[0]?.position || 'Professional'}</p>
        </div>
        
        {data.personalInfo.summary && (
          <div className="mb-4">
            <h4 className="font-bold text-xs text-slate-800 mb-1">• Summary</h4>
            <p className="text-slate-600 leading-relaxed pl-3">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-xs text-slate-800 mb-2">• Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-3 pl-3">
                <div className="flex justify-between">
                  <p className="font-bold" style={{ color: primary }}>{exp.position}</p>
                  <p className="text-slate-500 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
                </div>
                <p className="text-slate-600">{exp.company}</p>
                {exp.description && (
                  <ul className="mt-1 text-slate-600 space-y-0.5">
                    {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i}>• {line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        {data.education.length > 0 && (
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2">• Education</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2 pl-3">
                <p className="font-semibold" style={{ color: primary }}>{edu.degree}{edu.field && `, ${edu.field}`}</p>
                <p className="text-slate-600">{edu.school}</p>
                <p className="text-slate-500 text-[10px]">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Right Sidebar */}
      <div className="w-[30%] p-4 bg-slate-50">
        {/* Contact */}
        <div className="mb-4">
          <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Details</h4>
          <div className="space-y-1 text-slate-600 text-[10px]">
            {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          </div>
        </div>
        
        {data.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Skills</h4>
            <ul className="text-slate-600 space-y-0.5">
              {data.skills.map((skill: any) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.achievements.length > 0 && (
          <div>
            <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Achievements</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-2 text-[10px]">
                <p className="font-semibold text-slate-700">{ach.title}</p>
                {ach.date && <p className="text-slate-500">{ach.date}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Solstice Template - ATS Clean one-column (like Jessie Smith)
const SolsticeTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1e293b' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] p-5 bg-white">
      {/* Header */}
      <div className="mb-4 border-b pb-3" style={{ borderColor: `${primary}33` }}>
        <h1 className="font-bold text-2xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-slate-600">{data.experience[0]?.position || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-slate-500">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.email && <span>• {data.personalInfo.email}</span>}
        </div>
      </div>
      
      {data.personalInfo.summary && (
        <div className="mb-4">
          <h4 className="font-bold text-xs mb-1" style={{ color: primary }}>Summary</h4>
          <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Experience</h4>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-slate-800">{exp.position}</p>
                  <p className="text-slate-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                </div>
                <p className="text-slate-500 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
              </div>
              {exp.description && (
                <ul className="mt-1 text-slate-600 space-y-0.5 pl-3">
                  {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                    <li key={i}>• {line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {data.education.length > 0 && (
          <div>
            <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Education</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-slate-800">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                <p className="text-slate-600 text-[10px]">{edu.school}</p>
                <p className="text-slate-500 text-[10px]">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
        
        {data.skills.length > 0 && (
          <div>
            <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Skills</h4>
            <ul className="text-slate-600 space-y-0.5">
              {data.skills.map((skill: any) => (
                <li key={skill.id}>• {skill.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {data.achievements.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Achievements</h4>
          <ul className="text-slate-600 space-y-1">
            {data.achievements.map((ach: any) => (
              <li key={ach.id}>• {ach.title}{ach.description && ` - ${ach.description}`}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.projects.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-xs mb-2" style={{ color: primary }}>Projects</h4>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-2">
              <p className="font-semibold text-slate-800">{proj.name}</p>
              {proj.technologies && <p className="text-slate-500 text-[10px]">{proj.technologies}</p>}
              {proj.description && <p className="text-slate-600">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Zenith Template - ATS Minimal with lines
const ZenithTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#0f172a' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="font-light text-3xl tracking-wide text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
        <div className="w-16 h-0.5 mx-auto my-2" style={{ backgroundColor: primary }}></div>
        <p className="text-slate-500">{data.experience[0]?.position || 'Professional'}</p>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-400">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      {data.personalInfo.summary && (
        <div className="mb-5 text-center">
          <p className="text-slate-600 leading-relaxed max-w-[90%] mx-auto">{data.personalInfo.summary}</p>
        </div>
      )}
      
      {data.experience.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: primary }}>Experience</h4>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-semibold text-slate-800">{exp.position}</p>
                <p className="text-slate-400 text-[10px]">{exp.startDate} — {exp.endDate || 'Present'}</p>
              </div>
              <p className="text-slate-500">{exp.company}</p>
              {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: primary }}>Education</h4>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-slate-800 text-[10px]">{edu.degree}</p>
                <p className="text-slate-500 text-[10px]">{edu.school}, {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
        
        {data.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: primary }}>Skills</h4>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <p className="text-slate-600">{data.skills.map((s: any) => s.name).join(' • ')}</p>
          </div>
        )}
      </div>
      
      {data.achievements.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: primary }}>Achievements</h4>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="text-center text-slate-600">
            {data.achievements.map((ach: any, i: number) => (
              <span key={ach.id}>{ach.title}{i < data.achievements.length - 1 ? ' • ' : ''}</span>
            ))}
          </div>
        </div>
      )}
      
      {data.projects.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: primary }}>Projects</h4>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="mb-2 text-center">
              <p className="font-semibold text-slate-800">{proj.name}</p>
              {proj.description && <p className="text-slate-600">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Apex Template - ATS Professional with border
const ApexTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#334155' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] bg-white border-t-4" style={{ borderColor: primary }}>
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-200">
          <div>
            <h1 className="font-bold text-2xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-lg text-slate-600">{data.experience[0]?.position || 'Professional'}</p>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          </div>
        </div>
        
        {data.personalInfo.summary && (
          <div className="mb-4 p-3 bg-slate-50 rounded">
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-sm uppercase mb-2 pb-1 border-b" style={{ color: primary, borderColor: primary }}>Work Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-bold text-slate-800">{exp.position}</p>
                  <p className="text-slate-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
                <p style={{ color: primary }}>{exp.company}</p>
                {exp.description && (
                  <ul className="mt-1 text-slate-600">
                    {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i}>• {line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          {data.education.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase mb-2 pb-1 border-b" style={{ color: primary, borderColor: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-[10px]">{edu.degree}</p>
                  <p className="text-slate-500 text-[10px]">{edu.school}</p>
                  <p className="text-slate-400 text-[9px]">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          
          {data.skills.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase mb-2 pb-1 border-b" style={{ color: primary, borderColor: primary }}>Skills</h4>
              <ul className="text-slate-600 space-y-0.5">
                {data.skills.slice(0, 8).map((skill: any) => (
                  <li key={skill.id}>• {skill.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.achievements.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase mb-2 pb-1 border-b" style={{ color: primary, borderColor: primary }}>Achievements</h4>
              {data.achievements.slice(0, 4).map((ach: any) => (
                <div key={ach.id} className="mb-1 text-[10px]">
                  <p className="text-slate-700">• {ach.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {data.projects.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-xs uppercase mb-2 pb-1 border-b" style={{ color: primary, borderColor: primary }}>Projects</h4>
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <p className="font-semibold text-slate-800">{proj.name}</p>
                  {proj.description && <p className="text-slate-600 text-[10px]">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Horizon Template - ATS Modern with icons
const HorizonTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#475569' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] flex bg-white">
      {/* Left Sidebar */}
      <div className="w-[32%] p-4" style={{ backgroundColor: `${primary}10` }}>
        <div className="mb-4">
          <h1 className="font-bold text-lg text-slate-800 leading-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm" style={{ color: primary }}>{data.experience[0]?.position || 'Professional'}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Contact</h4>
          <div className="space-y-1.5 text-[10px] text-slate-600">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {data.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Skills</h4>
            <div className="space-y-1.5">
              {data.skills.map((skill: any) => (
                <div key={skill.id}>
                  <p className="text-slate-700 text-[10px] mb-0.5">{skill.name}</p>
                  <div className="h-1 bg-slate-200 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${skill.proficiency || 80}%`, backgroundColor: primary }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {data.education.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Education</h4>
            {data.education.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-[10px] text-slate-800">{edu.degree}</p>
                <p className="text-slate-600 text-[10px]">{edu.school}</p>
                <p className="text-slate-500 text-[9px]">{edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Right Content */}
      <div className="flex-1 p-4">
        {data.personalInfo.summary && (
          <div className="mb-4">
            <h4 className="font-bold text-xs uppercase mb-1" style={{ color: primary }}>Profile</h4>
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-3 pl-3 border-l-2" style={{ borderColor: primary }}>
                <div className="flex justify-between">
                  <p className="font-bold text-slate-800">{exp.position}</p>
                  <p className="text-slate-500 text-[10px]">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
                <p className="text-slate-600">{exp.company}</p>
                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        {data.projects.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Projects</h4>
            {data.projects.map((proj: any) => (
              <div key={proj.id} className="mb-2">
                <p className="font-semibold text-slate-800">{proj.name}</p>
                {proj.technologies && <p className="text-[10px]" style={{ color: primary }}>{proj.technologies}</p>}
                {proj.description && <p className="text-slate-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        {data.achievements.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase mb-2" style={{ color: primary }}>Achievements</h4>
            {data.achievements.map((ach: any) => (
              <div key={ach.id} className="mb-1 flex items-start gap-2">
                <span style={{ color: primary }}>★</span>
                <span className="text-slate-600">{ach.title}{ach.date && ` (${ach.date})`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Pinnacle Template - ATS Executive style
const PinnacleTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#1e293b' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] bg-white">
      {/* Header */}
      <div className="p-5 text-white" style={{ backgroundColor: primary }}>
        <h1 className="font-bold text-2xl">{data.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{data.experience[0]?.position || 'Executive Professional'}</p>
        <div className="flex gap-4 mt-2 text-sm opacity-75">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="p-5">
        {data.personalInfo.summary && (
          <div className="mb-5">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: primary }}>Executive Profile</h4>
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <div className="mb-5">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: primary }}>Professional Experience</h4>
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800">{exp.position}</p>
                    <p style={{ color: primary }}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
                  </div>
                  <p className="text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate || 'Present'}</p>
                </div>
                {exp.description && (
                  <ul className="mt-2 text-slate-600 space-y-1">
                    {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400">▸</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          {data.education.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: primary }}>Education</h4>
              {data.education.map((edu: any) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-slate-800 text-[10px]">{edu.degree}{edu.field && `, ${edu.field}`}</p>
                  <p className="text-slate-500 text-[10px]">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
          
          {data.skills.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: primary }}>Core Competencies</h4>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill: any) => (
                  <span key={skill.id} className="px-2 py-0.5 text-[9px] rounded" style={{ backgroundColor: `${primary}15`, color: primary }}>{skill.name}</span>
                ))}
              </div>
            </div>
          )}
          
          {data.achievements.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: primary }}>Key Achievements</h4>
              {data.achievements.map((ach: any) => (
                <p key={ach.id} className="text-slate-600 text-[10px] mb-1">★ {ach.title}</p>
              ))}
            </div>
          )}
        </div>
        
        {data.projects.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: primary }}>Notable Projects</h4>
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="p-2 bg-slate-50 rounded">
                  <p className="font-semibold text-slate-800">{proj.name}</p>
                  {proj.description && <p className="text-slate-600 text-[10px]">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Vertex Template - ATS Bold style
const VertexTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
  const primary = isMonochrome ? '#334155' : accentColor.primary;
  
  return (
    <div className="h-full text-[11px] bg-white">
      {/* Header with accent */}
      <div className="flex">
        <div className="w-2" style={{ backgroundColor: primary }}></div>
        <div className="flex-1 p-4">
          <h1 className="font-black text-2xl text-slate-800">{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-lg font-medium" style={{ color: primary }}>{data.experience[0]?.position || 'Professional'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-slate-500">
            {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>📞 {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {data.personalInfo.summary && (
          <div className="mb-4 p-3 border-l-4" style={{ borderColor: primary, backgroundColor: `${primary}05` }}>
            <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          {/* Main Content - 2 cols */}
          <div className="col-span-2">
            {data.experience.length > 0 && (
              <div className="mb-4">
                <h4 className="font-black text-xs uppercase mb-2" style={{ color: primary }}>Experience</h4>
                {data.experience.map((exp: any) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between">
                      <p className="font-bold text-slate-800">{exp.position}</p>
                      <p className="text-slate-400 text-[10px]">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    </div>
                    <p className="font-medium" style={{ color: primary }}>{exp.company}</p>
                    {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {data.projects.length > 0 && (
              <div>
                <h4 className="font-black text-xs uppercase mb-2" style={{ color: primary }}>Projects</h4>
                {data.projects.map((proj: any) => (
                  <div key={proj.id} className="mb-2">
                    <p className="font-bold text-slate-800">{proj.name}</p>
                    {proj.technologies && <p className="text-[10px]" style={{ color: primary }}>{proj.technologies}</p>}
                    {proj.description && <p className="text-slate-600">{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar - 1 col */}
          <div className="space-y-4">
            {data.skills.length > 0 && (
              <div>
                <h4 className="font-black text-xs uppercase mb-2" style={{ color: primary }}>Skills</h4>
                <div className="space-y-1">
                  {data.skills.map((skill: any) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }}></div>
                      <span className="text-slate-600">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.education.length > 0 && (
              <div>
                <h4 className="font-black text-xs uppercase mb-2" style={{ color: primary }}>Education</h4>
                {data.education.map((edu: any) => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-semibold text-slate-800 text-[10px]">{edu.degree}</p>
                    <p className="text-slate-500 text-[10px]">{edu.school}</p>
                    <p className="text-slate-400 text-[9px]">{edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}
            
            {data.achievements.length > 0 && (
              <div>
                <h4 className="font-black text-xs uppercase mb-2" style={{ color: primary }}>Achievements</h4>
                {data.achievements.map((ach: any) => (
                  <div key={ach.id} className="mb-1.5">
                    <p className="font-semibold text-slate-700 text-[10px]">{ach.title}</p>
                    {ach.date && <p className="text-slate-400 text-[9px]">{ach.date}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
