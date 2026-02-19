import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Users,
  Clock,
  Zap,
  BookOpen
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Tips: React.FC = () => {
  const sections = [
    {
      title: 'Resume Writing Essentials',
      icon: FileText,
      color: 'blue',
      tips: [
        {
          do: 'Use action verbs to start each bullet point',
          dont: 'Start with "I was responsible for..."',
          example: '✓ "Developed and launched a mobile app with 10,000+ downloads"'
        },
        {
          do: 'Quantify your achievements with numbers',
          dont: 'Use vague descriptions like "improved sales"',
          example: '✓ "Increased quarterly sales by 35%, generating $500K in revenue"'
        },
        {
          do: 'Tailor your resume for each job application',
          dont: 'Send the same resume to every company',
          example: '✓ Match keywords from the job description'
        },
        {
          do: 'Keep it to 1-2 pages maximum',
          dont: 'Include every job you\'ve ever had',
          example: '✓ Focus on relevant experience from the last 10-15 years'
        }
      ]
    },
    {
      title: 'ATS Optimization',
      icon: Target,
      color: 'purple',
      tips: [
        {
          do: 'Use standard section headings (Education, Experience, Skills)',
          dont: 'Use creative headers like "My Journey" or "What I Know"',
          example: '✓ WORK EXPERIENCE, EDUCATION, SKILLS'
        },
        {
          do: 'Save your resume as PDF or DOCX',
          dont: 'Use images, graphics, or unusual fonts',
          example: '✓ Simple, clean formatting with standard fonts'
        },
        {
          do: 'Include exact keywords from job posting',
          dont: 'Stuff keywords unnaturally',
          example: '✓ If job asks for "Python", include "Python" not just "programming"'
        },
        {
          do: 'Use bullet points for easy scanning',
          dont: 'Write long paragraphs',
          example: '✓ 3-5 bullet points per job role'
        }
      ]
    },
    {
      title: 'Professional Summary',
      icon: Briefcase,
      color: 'green',
      tips: [
        {
          do: 'Write a compelling 2-3 sentence summary',
          dont: 'Use generic statements like "hardworking professional"',
          example: '✓ "Results-driven Software Engineer with 5+ years experience in building scalable web applications using React and Node.js"'
        },
        {
          do: 'Highlight your unique value proposition',
          dont: 'List job duties without context',
          example: '✓ Mention your specialty and key achievement'
        }
      ]
    },
    {
      title: 'Work Experience',
      icon: TrendingUp,
      color: 'orange',
      tips: [
        {
          do: 'Use the CAR method (Challenge, Action, Result)',
          dont: 'Just list job responsibilities',
          example: '✓ "Faced high customer churn (Challenge) → Implemented loyalty program (Action) → Reduced churn by 25% (Result)"'
        },
        {
          do: 'Focus on achievements, not duties',
          dont: 'Write "Responsible for managing team"',
          example: '✓ "Led 8-person team to deliver project 2 weeks ahead of schedule"'
        },
        {
          do: 'Use present tense for current job, past tense for previous',
          dont: 'Mix tenses inconsistently',
          example: '✓ Current: "Manage..." Past: "Managed..."'
        }
      ]
    },
    {
      title: 'Skills Section',
      icon: Zap,
      color: 'cyan',
      tips: [
        {
          do: 'Categorize skills (Technical, Soft, Tools)',
          dont: 'List 50 random skills',
          example: '✓ Technical: Python, JavaScript | Tools: Git, Docker | Soft: Leadership'
        },
        {
          do: 'Include proficiency levels if relevant',
          dont: 'Rate yourself 10/10 on everything',
          example: '✓ Python (Advanced), SQL (Intermediate)'
        }
      ]
    },
    {
      title: 'Education',
      icon: GraduationCap,
      color: 'indigo',
      tips: [
        {
          do: 'Include degree, institution, graduation year',
          dont: 'List high school if you have a college degree',
          example: '✓ B.S. Computer Science, MIT, 2022 | GPA: 3.8/4.0'
        },
        {
          do: 'Add relevant coursework, projects, or honors',
          dont: 'Include every class you took',
          example: '✓ Relevant Coursework: Machine Learning, Data Structures'
        }
      ]
    }
  ];

  const actionVerbs = {
    leadership: ['Led', 'Directed', 'Managed', 'Supervised', 'Coordinated', 'Spearheaded', 'Orchestrated'],
    achievement: ['Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Earned', 'Won'],
    creation: ['Created', 'Designed', 'Developed', 'Built', 'Established', 'Launched', 'Initiated'],
    improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Upgraded', 'Revamped', 'Transformed'],
    analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined', 'Identified'],
    communication: ['Presented', 'Negotiated', 'Collaborated', 'Communicated', 'Influenced', 'Persuaded']
  };

  const commonMistakes = [
    { mistake: 'Typos and grammatical errors', fix: 'Proofread multiple times, use Grammarly' },
    { mistake: 'Including personal info (age, photo, marital status)', fix: 'Only include contact info' },
    { mistake: 'Using "References available upon request"', fix: 'Remove it - it\'s understood' },
    { mistake: 'Listing every job since high school', fix: 'Focus on relevant, recent experience' },
    { mistake: 'Using first person (I, me, my)', fix: 'Remove pronouns from bullet points' },
    { mistake: 'Including salary information', fix: 'Never mention salary on resume' },
    { mistake: 'Using unprofessional email', fix: 'Create a professional email (firstname.lastname@)' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Career Resources</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Resume Writing{' '}
            <span className="gradient-text">Tips & Guide</span>
          </h1>
          <p className="text-muted-foreground">
            Expert tips and best practices to help you create a resume that gets noticed by recruiters and passes ATS systems.
          </p>
        </motion.div>

        {/* Tips Sections */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-${section.color}-100 dark:bg-${section.color}-900/30`}>
                  <section.icon className={`w-6 h-6 text-${section.color}-600`} />
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400 text-sm">DO</p>
                          <p className="text-sm">{tip.do}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400 text-sm">DON'T</p>
                          <p className="text-sm">{tip.dont}</p>
                        </div>
                      </div>
                    </div>
                    {tip.example && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{tip.example}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Verbs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-500" />
              Power Action Verbs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(actionVerbs).map(([category, verbs]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold capitalize text-sm text-muted-foreground">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {verbs.map(verb => (
                      <span 
                        key={verb} 
                        className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm shadow-sm"
                      >
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Common Mistakes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              Common Resume Mistakes to Avoid
            </h2>
            <div className="space-y-4">
              {commonMistakes.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-red-600 dark:text-red-400">{item.mistake}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-green-600 dark:text-green-400 font-medium">Fix:</span> {item.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Build Your Resume?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Use our AI-powered resume builder to create an ATS-optimized resume in minutes.
            </p>
            <a 
              href="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Building Now
              <TrendingUp className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Tips;
