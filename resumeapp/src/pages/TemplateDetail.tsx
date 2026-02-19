import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Download, Eye, CheckCircle, Share2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// All templates data
const templatesData: Record<string, {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  downloads: string;
  atsOptimized: boolean;
  atsScore: number;
  description: string;
  features: string[];
  bestFor: string[];
  color: string;
  accentColor: string;
}> = {
  'classic-1': {
    name: 'Professional Classic',
    category: 'Classic',
    rating: 4.9,
    reviews: 234,
    downloads: '12,450',
    atsOptimized: true,
    atsScore: 92,
    description: 'A timeless, ATS-friendly resume template perfect for traditional industries and corporate roles.',
    features: ['ATS-optimized formatting', 'Clean, professional layout', 'Easy to customize', 'Print-ready PDF export'],
    bestFor: ['Software Engineer', 'Manager', 'Accountant', 'Consultant'],
    color: 'from-slate-100 to-slate-200',
    accentColor: 'blue',
  },
  'modern-1': {
    name: 'Modern Minimal',
    category: 'Modern',
    rating: 4.8,
    reviews: 189,
    downloads: '8,200',
    atsOptimized: true,
    atsScore: 89,
    description: 'A sleek, modern design with sidebar layout. Perfect for tech and creative professionals.',
    features: ['Sidebar design', 'Skills visualization', 'Modern typography', 'Color customizable'],
    bestFor: ['Designer', 'Developer', 'Product Manager', 'Marketing'],
    color: 'from-blue-100 to-indigo-100',
    accentColor: 'indigo',
  },
  'creative-1': {
    name: 'Creative Edge',
    category: 'Creative',
    rating: 4.7,
    reviews: 156,
    downloads: '5,800',
    atsOptimized: false,
    atsScore: 75,
    description: 'Stand out with this bold, creative template. Ideal for designers and creative professionals.',
    features: ['Unique layout', 'Visual elements', 'Portfolio section', 'Bold colors'],
    bestFor: ['Graphic Designer', 'Artist', 'Creative Director', 'UI/UX Designer'],
    color: 'from-purple-100 to-pink-100',
    accentColor: 'purple',
  },
  'executive-1': {
    name: 'Executive Pro',
    category: 'Executive',
    rating: 4.9,
    reviews: 312,
    downloads: '9,100',
    atsOptimized: true,
    atsScore: 94,
    description: 'Premium executive template for senior professionals and leadership positions.',
    features: ['Executive summary', 'Achievement focused', 'Leadership highlight', 'Professional'],
    bestFor: ['CEO', 'Director', 'VP', 'Senior Manager'],
    color: 'from-amber-100 to-orange-100',
    accentColor: 'amber',
  },
  'tech-1': {
    name: 'Tech Innovator',
    category: 'Tech',
    rating: 4.8,
    reviews: 278,
    downloads: '7,500',
    atsOptimized: true,
    atsScore: 91,
    description: 'Built for developers and tech professionals. Showcase your skills and projects effectively.',
    features: ['Skills badges', 'Project showcase', 'GitHub integration', 'Tech-focused'],
    bestFor: ['Software Engineer', 'Data Scientist', 'DevOps', 'Full Stack Developer'],
    color: 'from-cyan-100 to-blue-100',
    accentColor: 'cyan',
  },
  'minimal-1': {
    name: 'Minimal & Clean',
    category: 'Simple',
    rating: 4.6,
    reviews: 145,
    downloads: '6,200',
    atsOptimized: true,
    atsScore: 88,
    description: 'Less is more. A clean, minimal design that lets your content shine.',
    features: ['Ultra clean', 'Minimal design', 'Easy to read', 'High ATS score'],
    bestFor: ['Any Professional', 'Fresher', 'Career Changer', 'Consultant'],
    color: 'from-gray-100 to-zinc-100',
    accentColor: 'gray',
  },
  'academic-1': {
    name: 'Academic Scholar',
    category: 'Academic',
    rating: 4.8,
    reviews: 167,
    downloads: '5,400',
    atsOptimized: true,
    atsScore: 90,
    description: 'Comprehensive CV template for academics, researchers, and educators.',
    features: ['Publications section', 'Research focus', 'Education highlight', 'Grants & Awards'],
    bestFor: ['Professor', 'Researcher', 'PhD Student', 'Scientist'],
    color: 'from-emerald-100 to-teal-100',
    accentColor: 'emerald',
  },
  'entry-1': {
    name: 'Fresh Graduate',
    category: 'Entry Level',
    rating: 4.9,
    reviews: 423,
    downloads: '18,200',
    atsOptimized: true,
    atsScore: 86,
    description: 'Perfect for fresh graduates and entry-level job seekers. Highlight your potential.',
    features: ['Education focus', 'Projects section', 'Skills highlight', 'Internship friendly'],
    bestFor: ['Fresh Graduate', 'Intern', 'Entry Level', 'Student'],
    color: 'from-green-100 to-emerald-100',
    accentColor: 'green',
  },
};

// Default template if not found
const defaultTemplate = {
  name: 'Professional Template',
  category: 'Classic',
  rating: 4.5,
  reviews: 100,
  downloads: '5,000',
  atsOptimized: true,
  atsScore: 85,
  description: 'A professional resume template suitable for any industry.',
  features: ['ATS-optimized', 'Clean layout', 'Easy to customize', 'PDF export'],
  bestFor: ['Any Professional'],
  color: 'from-slate-100 to-slate-200',
  accentColor: 'blue',
};

const TemplateDetail: React.FC = () => {
  const { id } = useParams();
  const template = templatesData[id || ''] || defaultTemplate;

  // Get category to determine preview style
  const getPreviewContent = () => {
    switch (template.category) {
      case 'Modern':
        return (
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-1/3 bg-gradient-to-b from-indigo-600 to-blue-700 p-4 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold">JD</span>
              </div>
              <div className="text-center mb-4">
                <h3 className="font-bold text-sm">John Doe</h3>
                <p className="text-xs opacity-80">Software Engineer</p>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">CONTACT</p>
                  <p className="opacity-70">john@email.com</p>
                  <p className="opacity-70">(555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">SKILLS</p>
                  <div className="space-y-1">
                    {['React', 'Node.js', 'Python'].map(skill => (
                      <div key={skill} className="flex items-center gap-1">
                        <div className="w-full bg-white/20 rounded-full h-1">
                          <div className="bg-white h-1 rounded-full" style={{width: '80%'}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-1">John Doe</h2>
              <p className="text-xs text-gray-500 mb-3">Senior Software Engineer</p>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 mb-1">EXPERIENCE</h4>
                  <p className="text-xs font-medium">Software Engineer - Google</p>
                  <p className="text-[10px] text-gray-500">2020 - Present</p>
                  <p className="text-[10px] text-gray-600 mt-1">Led development of key features...</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 mb-1">EDUCATION</h4>
                  <p className="text-xs font-medium">B.S. Computer Science</p>
                  <p className="text-[10px] text-gray-500">Stanford University</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Creative':
        return (
          <div className="h-full p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">John Doe</h2>
                <p className="text-xs text-purple-600">Creative Director</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <h4 className="text-[10px] font-bold text-purple-600 mb-1">ABOUT</h4>
                <p className="text-[9px] text-gray-600">Creative professional with 8+ years...</p>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <h4 className="text-[10px] font-bold text-pink-600 mb-1">SKILLS</h4>
                <div className="flex flex-wrap gap-1">
                  {['Design', 'UI/UX', 'Figma'].map(s => (
                    <span key={s} className="px-1 py-0.5 bg-purple-100 rounded text-[8px] text-purple-700">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <h4 className="text-[10px] font-bold text-purple-600 mb-1">EXPERIENCE</h4>
              <p className="text-[9px] font-medium">Creative Director - Apple</p>
              <p className="text-[8px] text-gray-500">2018 - Present</p>
            </div>
          </div>
        );

      case 'Tech':
        return (
          <div className="h-full p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg">{'</>'}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">John Doe</h2>
                <p className="text-xs text-cyan-600">Full Stack Developer</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {['React', 'Node.js', 'TypeScript', 'Python', 'AWS'].map(skill => (
                <span key={skill} className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-[9px] font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <div className="border-l-2 border-cyan-500 pl-2">
                <h4 className="text-xs font-bold text-gray-800">Software Engineer</h4>
                <p className="text-[10px] text-cyan-600">Microsoft • 2020 - Present</p>
                <p className="text-[9px] text-gray-600 mt-1">Built scalable microservices...</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-2">
                <h4 className="text-xs font-bold text-gray-800">Junior Developer</h4>
                <p className="text-[10px] text-blue-600">Startup Inc • 2018 - 2020</p>
              </div>
            </div>
          </div>
        );

      case 'Executive':
        return (
          <div className="h-full p-4">
            <div className="text-center border-b-2 border-amber-500 pb-3 mb-3">
              <h2 className="text-xl font-bold text-gray-800 tracking-wide">JOHN DOE</h2>
              <p className="text-xs text-amber-600 font-medium mt-1">Chief Executive Officer</p>
              <p className="text-[10px] text-gray-500 mt-1">john@email.com | San Francisco, CA</p>
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-bold text-amber-700 mb-1">EXECUTIVE SUMMARY</h4>
                <p className="text-[10px] text-gray-600">Visionary leader with 15+ years driving organizational growth...</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-700 mb-1">KEY ACHIEVEMENTS</h4>
                <ul className="text-[9px] text-gray-600 space-y-0.5">
                  <li>• Increased revenue by 200% in 3 years</li>
                  <li>• Led acquisition of 3 companies</li>
                  <li>• Built team from 10 to 500 employees</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'Academic':
        return (
          <div className="h-full p-4">
            <div className="border-b border-emerald-300 pb-2 mb-3">
              <h2 className="text-lg font-bold text-gray-800">Dr. John Doe, PhD</h2>
              <p className="text-xs text-emerald-600">Associate Professor of Computer Science</p>
              <p className="text-[10px] text-gray-500">Stanford University</p>
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-bold text-emerald-700 mb-1">RESEARCH INTERESTS</h4>
                <p className="text-[9px] text-gray-600">Machine Learning, NLP, Computer Vision</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-700 mb-1">PUBLICATIONS</h4>
                <p className="text-[9px] text-gray-600 italic">"Deep Learning Advances" - Nature, 2023</p>
                <p className="text-[9px] text-gray-600 italic">"AI in Healthcare" - Science, 2022</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-700 mb-1">EDUCATION</h4>
                <p className="text-[9px] text-gray-600">PhD Computer Science - MIT</p>
              </div>
            </div>
          </div>
        );

      case 'Entry Level':
        return (
          <div className="h-full p-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                JD
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">John Doe</h2>
                <p className="text-xs text-green-600">Computer Science Graduate</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-bold text-green-700 mb-1">EDUCATION</h4>
                <p className="text-[10px] font-medium">B.S. Computer Science</p>
                <p className="text-[9px] text-gray-500">University of California • GPA: 3.8</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 mb-1">PROJECTS</h4>
                <p className="text-[9px] text-gray-600">• E-commerce App (React, Node.js)</p>
                <p className="text-[9px] text-gray-600">• ML Image Classifier (Python)</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 mb-1">SKILLS</h4>
                <div className="flex flex-wrap gap-1">
                  {['Python', 'JavaScript', 'React'].map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-green-100 rounded text-[8px] text-green-700">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Simple':
        return (
          <div className="h-full p-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">John Doe</h2>
              <p className="text-xs text-gray-500">john@email.com | (555) 123-4567</p>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-1 mb-1">Summary</h4>
                <p className="text-[10px] text-gray-600">Experienced professional seeking new opportunities...</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-1 mb-1">Experience</h4>
                <p className="text-[10px] font-medium">Senior Analyst - Company Inc</p>
                <p className="text-[9px] text-gray-500">2019 - Present</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-1 mb-1">Education</h4>
                <p className="text-[10px]">Bachelor's Degree - University</p>
              </div>
            </div>
          </div>
        );

      default: // Classic
        return (
          <div className="h-full p-4">
            <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
              <h2 className="text-xl font-bold text-gray-800">JOHN DOE</h2>
              <p className="text-xs text-gray-600 mt-1">
                john.doe@email.com | (555) 123-4567 | San Francisco, CA
              </p>
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-bold border-b border-gray-300 pb-1 mb-1">SUMMARY</h4>
                <p className="text-[10px] text-gray-600">Results-driven professional with 7+ years of experience...</p>
              </div>
              <div>
                <h4 className="text-xs font-bold border-b border-gray-300 pb-1 mb-1">EXPERIENCE</h4>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-medium">Senior Manager</p>
                    <p className="text-[9px] text-gray-500">Fortune 500 Company</p>
                  </div>
                  <p className="text-[9px] text-gray-500">2020 - Present</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold border-b border-gray-300 pb-1 mb-1">EDUCATION</h4>
                <p className="text-[10px]">MBA - Harvard Business School</p>
              </div>
              <div>
                <h4 className="text-xs font-bold border-b border-gray-300 pb-1 mb-1">SKILLS</h4>
                <p className="text-[9px] text-gray-600">Leadership, Strategy, Analytics, Management</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Link to="/templates" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={`bg-gradient-to-br ${template.color} dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 sticky top-24`}>
              <div className="bg-white rounded-lg shadow-2xl aspect-[8.5/11] overflow-hidden">
                {getPreviewContent()}
              </div>
              {/* ATS Score */}
              <div className="mt-4 bg-white/80 dark:bg-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">ATS Score</span>
                  <span className="text-lg font-bold text-green-600">{template.atsScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${template.atsScore}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{template.category}</Badge>
                {template.atsOptimized && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ATS Optimized
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{template.rating}</span>
                  <span className="text-muted-foreground">({template.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span>{template.downloads} downloads</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{template.description}</p>

            {/* Actions */}
            <div className="flex gap-4">
              <Link to="/builder" className="flex-1">
                <Button className="w-full gradient-bg text-lg py-6">
                  Use This Template
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Eye className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {template.bestFor.map((role) => (
                  <Badge key={role} variant="secondary">{role}</Badge>
                ))}
              </div>
            </div>

            {/* Similar Templates */}
            <div>
              <h3 className="font-semibold mb-4">Similar Templates</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Link key={i} to={`/templates/similar-${i}`}>
                    <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-2 hover-lift cursor-pointer">
                      <div className="bg-white dark:bg-card h-full rounded shadow-sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetail;
