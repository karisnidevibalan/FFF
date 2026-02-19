import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award,
  ExternalLink,
  Download,
  FileText,
  Calendar,
  User,
  Code,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// This would typically come from the backend
interface PublicResumeData {
  _id: string;
  title: string;
  template: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    professionalSummary: string;
    profileImage?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string;
  }>;
  education: Array<{
    schoolName: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    projectName: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    certificationName: string;
    issuer: string;
    issueDate: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
}

const PublicResumePage = () => {
  const { shareId } = useParams();
  const [resume, setResume] = useState<PublicResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicResume();
    trackView();
  }, [shareId]);

  const loadPublicResume = async () => {
    try {
      setLoading(true);
      // In production, fetch from API:
      // const response = await fetch(`/api/resume/public/${shareId}`);
      // const data = await response.json();
      
      // Demo data for showcase
      const demoResume: PublicResumeData = {
        _id: shareId || 'demo',
        title: 'Software Engineer Resume',
        template: 'modern',
        personalInfo: {
          fullName: 'Alex Johnson',
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          professionalSummary: 'Passionate Software Engineer with 5+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions that drive business growth.',
          profileImage: '',
          linkedin: 'linkedin.com/in/alexjohnson',
          github: 'github.com/alexjohnson',
          website: 'alexjohnson.dev',
        },
        experience: [
          {
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Corp Inc.',
            location: 'San Francisco, CA',
            startDate: '2021-01',
            endDate: '',
            currentlyWorking: true,
            description: '• Led development of microservices architecture serving 10M+ users\n• Reduced API response time by 60% through optimization\n• Mentored 5 junior developers and conducted code reviews',
          },
          {
            jobTitle: 'Software Engineer',
            company: 'StartupXYZ',
            location: 'San Jose, CA',
            startDate: '2019-03',
            endDate: '2020-12',
            currentlyWorking: false,
            description: '• Built React dashboard used by 500+ enterprise clients\n• Implemented CI/CD pipeline reducing deployment time by 80%\n• Collaborated with design team to improve UX',
          },
        ],
        education: [
          {
            schoolName: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            startDate: '2017',
            endDate: '2019',
            gpa: '3.9',
          },
          {
            schoolName: 'UC Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2013',
            endDate: '2017',
            gpa: '3.7',
          },
        ],
        skills: [
          { name: 'React', level: 'expert' },
          { name: 'TypeScript', level: 'expert' },
          { name: 'Node.js', level: 'advanced' },
          { name: 'Python', level: 'advanced' },
          { name: 'AWS', level: 'advanced' },
          { name: 'Docker', level: 'intermediate' },
          { name: 'PostgreSQL', level: 'advanced' },
          { name: 'GraphQL', level: 'intermediate' },
        ],
        projects: [
          {
            projectName: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
            link: 'github.com/alex/ecommerce',
          },
          {
            projectName: 'AI Chat Assistant',
            description: 'GPT-powered chatbot for customer support',
            technologies: ['Python', 'FastAPI', 'OpenAI', 'Redis'],
            link: 'github.com/alex/ai-chat',
          },
        ],
        certifications: [
          {
            certificationName: 'AWS Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2023-06',
          },
          {
            certificationName: 'Google Cloud Professional',
            issuer: 'Google',
            issueDate: '2022-09',
          },
        ],
        languages: [
          { language: 'English', proficiency: 'native' },
          { language: 'Spanish', proficiency: 'professional' },
        ],
      };

      setResume(demoResume);
      setError('');
    } catch (err) {
      setError('Resume not found or link has expired');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      // Track resume view for analytics
      // await fetch(`/api/resume/track-view/${shareId}`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to track view');
    }
  };

  const getSkillLevel = (level: string): number => {
    const levels: Record<string, number> = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100,
    };
    return levels[level] || 50;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Resume Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'This resume link may have expired or been removed.'}
            </p>
            <Link to="/">
              <Button>Create Your Own Resume</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <FileText className="w-4 h-4" />
            <span>Resumify</span>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8">
              <div className="flex items-start gap-6">
                {resume.personalInfo.profileImage ? (
                  <img
                    src={resume.personalInfo.profileImage}
                    alt={resume.personalInfo.fullName}
                    className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                    <User className="w-12 h-12 text-white/80" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{resume.personalInfo.fullName}</h1>
                  <div className="flex flex-wrap gap-4 text-sm opacity-90">
                    {resume.personalInfo.email && (
                      <a href={`mailto:${resume.personalInfo.email}`} className="flex items-center gap-1 hover:opacity-100">
                        <Mail className="w-4 h-4" />
                        {resume.personalInfo.email}
                      </a>
                    )}
                    {resume.personalInfo.phone && (
                      <a href={`tel:${resume.personalInfo.phone}`} className="flex items-center gap-1 hover:opacity-100">
                        <Phone className="w-4 h-4" />
                        {resume.personalInfo.phone}
                      </a>
                    )}
                    {resume.personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {resume.personalInfo.location}
                      </span>
                    )}
                  </div>
                  {/* Social Links */}
                  <div className="flex gap-3 mt-3">
                    {resume.personalInfo.linkedin && (
                      <a href={`https://${resume.personalInfo.linkedin}`} target="_blank" rel="noopener" className="hover:opacity-100 opacity-80">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {resume.personalInfo.github && (
                      <a href={`https://${resume.personalInfo.github}`} target="_blank" rel="noopener" className="hover:opacity-100 opacity-80">
                        <Code className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Main Content - 2 columns */}
              <div className="md:col-span-2 space-y-8">
                {/* Summary */}
                {resume.personalInfo.professionalSummary && (
                  <section>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Professional Summary
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {resume.personalInfo.professionalSummary}
                    </p>
                  </section>
                )}

                {/* Experience */}
                {resume.experience.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {resume.experience.map((exp, index) => (
                        <div key={index} className="relative pl-6 border-l-2 border-primary/20">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                            <h3 className="font-semibold">{exp.jobTitle}</h3>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-primary font-medium text-sm mb-2">
                            {exp.company} • {exp.location}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      Education
                    </h2>
                    <div className="space-y-4">
                      {resume.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                            <p className="text-primary text-sm">{edu.schoolName}</p>
                            {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      Projects
                    </h2>
                    <div className="space-y-4">
                      {resume.projects.map((project, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{project.projectName}</h3>
                            {project.link && (
                              <a href={`https://${project.link}`} target="_blank" rel="noopener" className="text-primary hover:underline">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-8">
                {/* Skills */}
                {resume.skills.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Skills
                    </h2>
                    <div className="space-y-3">
                      {resume.skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill.name}</span>
                            <span className="text-muted-foreground capitalize">{skill.level}</span>
                          </div>
                          <Progress value={getSkillLevel(skill.level)} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {resume.certifications.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Certifications
                    </h2>
                    <div className="space-y-3">
                      {resume.certifications.map((cert, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-sm">{cert.certificationName}</h3>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(cert.issueDate)}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {resume.languages.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4">Languages</h2>
                    <div className="space-y-2">
                      {resume.languages.map((lang, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{lang.language}</span>
                          <Badge variant="outline" className="capitalize">
                            {lang.proficiency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Created with <Link to="/" className="text-primary hover:underline">Resumify</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicResumePage;
