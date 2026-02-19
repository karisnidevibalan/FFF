import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { resumeService } from '@/services/resumeService';
import { defaultResume } from '@/constants/templates';
import { Save, ArrowLeft, Sparkles } from 'lucide-react';
import PDFExport from '@/components/resume/PDFExport';
import ProfilePhotoUpload from '@/components/resume/ProfilePhotoUpload';
import AISuggestions from '@/components/ai/AISuggestions';

interface Resume {
  _id: string;
  title: string;
  template: string;
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  languages: any[];
  atsScore: number;
}

export default function ResumeEditor() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setLoading(true);
      if (resumeId) {
        const data = await resumeService.getResume(resumeId);
        setResume(data);
        setAtsScore(data.atsScore || 0);
      }
      setError('');
    } catch (err) {
      setError('Failed to load resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume || !resumeId) return;

    try {
      setSaving(true);
      const updated = await resumeService.updateResume(resumeId, resume);
      setResume(updated);
      setAtsScore(updated.atsScore || 0);
      alert('Resume saved successfully!');
    } catch (err) {
      setError('Failed to save resume');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalInfoChange = (field: string, value: any) => {
    if (resume) {
      setResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          [field]: value,
        },
      });
    }
  };

  const handleAddExperience = () => {
    if (resume) {
      setResume({
        ...resume,
        experience: [
          ...resume.experience,
          {
            company: '',
            jobTitle: '',
            startDate: '',
            endDate: '',
            description: '',
          },
        ],
      });
    }
  };

  const handleAddEducation = () => {
    if (resume) {
      setResume({
        ...resume,
        education: [
          ...resume.education,
          {
            institution: '',
            degree: '',
            fieldOfStudy: '',
            graduationYear: '',
          },
        ],
      });
    }
  };

  const handleAddSkill = () => {
    if (resume) {
      setResume({
        ...resume,
        skills: [
          ...resume.skills,
          {
            name: '',
            level: 'intermediate',
          },
        ],
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero-bg pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-hero-bg pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="glass-effect border-0">
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Resume not found
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero-bg pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{resume.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">Edit your resume</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PDFExport 
              resumeRef={resumePreviewRef} 
              resumeName={resume.title} 
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Resume'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ATS Score Display */}
        <Card className="glass-effect border-0 mb-6">
          <CardHeader>
            <CardTitle>ATS Score</CardTitle>
            <CardDescription>How well your resume is optimized for ATS systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {atsScore}/100
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal" className="space-y-4">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Photo */}
                <div className="flex justify-center mb-6">
                  <ProfilePhotoUpload
                    currentPhoto={resume.personalInfo.profileImage || ''}
                    onPhotoChange={(photoUrl) => handlePersonalInfoChange('profileImage', photoUrl)}
                    userName={resume.personalInfo.fullName || 'User'}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={resume.personalInfo.fullName || ''}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={resume.personalInfo.email || ''}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={resume.personalInfo.phone || ''}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={resume.personalInfo.location || ''}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="City, State"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Professional Summary</label>
                  <Textarea
                    value={resume.personalInfo.professionalSummary || ''}
                    onChange={(e) => handlePersonalInfoChange('professionalSummary', e.target.value)}
                    placeholder="Write a brief professional summary..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                {/* AI Suggestions for Summary */}
                <AISuggestions
                  section="summary"
                  currentContent={resume.personalInfo.professionalSummary || ''}
                  jobTitle={resume.title}
                  onApplySuggestion={(suggestion) => handlePersonalInfoChange('professionalSummary', suggestion)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience" className="space-y-4">
            <Card className="glass-effect border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={handleAddExperience} size="sm">
                    + Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Suggestions for Experience */}
                <AISuggestions
                  section="experience"
                  jobTitle={resume.title}
                />
                
                {resume.experience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input placeholder="Company Name" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Job Title</label>
                        <Input placeholder="Job Title" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input type="month" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input type="month" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your responsibilities..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-4">
            <Card className="glass-effect border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Education</CardTitle>
                  <Button onClick={handleAddEducation} size="sm">
                    + Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Institution</label>
                        <Input placeholder="University Name" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Degree</label>
                        <Input placeholder="Bachelor's / Master's" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Field of Study</label>
                        <Input placeholder="Computer Science" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Graduation Year</label>
                        <Input type="number" placeholder="2024" className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" className="space-y-4">
            <Card className="glass-effect border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={handleAddSkill} size="sm">
                    + Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input placeholder="Skill name" className="flex-1" />
                      <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate" selected>Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" className="space-y-4">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">Projects section coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
