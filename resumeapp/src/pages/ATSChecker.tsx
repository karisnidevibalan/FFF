import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  RefreshCw,
  Edit3,
  Briefcase,
  Zap,
  BookOpen,
  User,
  Mail,
  Star,
  ListChecks,
  Lock,
  Crown
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

import { resumeService } from '@/services/resumeService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DetailedScore {
  category: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  details: string[];
}

interface AnalysisResult {
  overallScore: number;
  detailedScores: DetailedScore[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
}

// Industry-specific keywords database
const industryKeywords: Record<string, string[]> = {
  technology: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'angular', 'vue', 'node.js',
    'aws', 'azure', 'docker', 'kubernetes', 'sql', 'mongodb', 'git', 'agile', 'scrum',
    'api', 'rest', 'graphql', 'microservices', 'cloud', 'devops', 'ci/cd', 'testing'
  ],
  marketing: [
    'seo', 'sem', 'social media', 'content marketing', 'analytics', 'google analytics',
    'campaign', 'branding', 'digital marketing', 'email marketing', 'crm', 'hubspot',
    'conversion', 'roi', 'kpi', 'market research', 'strategy'
  ],
  finance: [
    'financial analysis', 'budgeting', 'forecasting', 'excel', 'financial modeling',
    'accounting', 'audit', 'compliance', 'risk management', 'investment', 'portfolio',
    'reporting', 'variance analysis', 'erp', 'sap'
  ],
  healthcare: [
    'patient care', 'clinical', 'hipaa', 'ehr', 'medical', 'healthcare', 'nursing',
    'diagnosis', 'treatment', 'pharmacy', 'compliance', 'safety protocols'
  ],
  general: [
    'leadership', 'management', 'communication', 'teamwork', 'problem-solving',
    'analytical', 'project management', 'presentation', 'negotiation', 'strategic planning',
    'microsoft office', 'excel', 'powerpoint', 'collaboration'
  ]
};

// Action verbs that ATS systems look for
const actionVerbs = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created', 'decreased',
  'delivered', 'designed', 'developed', 'directed', 'established', 'expanded', 'generated',
  'grew', 'implemented', 'improved', 'increased', 'introduced', 'launched', 'led', 'managed',
  'negotiated', 'optimized', 'orchestrated', 'organized', 'oversaw', 'planned', 'produced',
  'reduced', 'resolved', 'spearheaded', 'streamlined', 'supervised', 'trained', 'transformed'
];

// Required resume sections
const requiredSections = [
  { name: 'Contact Information', patterns: ['email', 'phone', '@', 'linkedin'] },
  { name: 'Professional Summary', patterns: ['summary', 'objective', 'profile', 'about me'] },
  { name: 'Work Experience', patterns: ['experience', 'employment', 'work history', 'professional experience'] },
  { name: 'Education', patterns: ['education', 'academic', 'university', 'college', 'degree', 'bachelor', 'master'] },
  { name: 'Skills', patterns: ['skills', 'technical skills', 'competencies', 'expertise'] }
];

const ATSChecker: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [analysisMode, setAnalysisMode] = useState<'general' | 'job'>('general');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [semanticResult, setSemanticResult] = useState<any>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremium = () => {
      const premiumStatus = localStorage.getItem('isPremium') === 'true';
      setIsPremium(premiumStatus);
    };
    checkPremium();
    // Listen for storage events in case it changes in another tab
    window.addEventListener('storage', checkPremium);
    return () => window.removeEventListener('storage', checkPremium);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to parse PDF');
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      setFile(uploadedFile);

      if (uploadedFile.type === 'application/pdf') {
        try {
          const text = await extractTextFromPdf(uploadedFile);
          setResumeText(text);
        } catch (err) {
          setError('Failed to read PDF file.');
        }
      } else {
        // Fallback or text/plain
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string || '');
        };
        reader.readAsText(uploadedFile);
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);

      if (uploadedFile.type === 'application/pdf') {
        try {
          const text = await extractTextFromPdf(uploadedFile);
          setResumeText(text);
        } catch (err) {
          setError('Failed to read PDF file.');
        }
      } else {
        // Fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string || '');
        };
        reader.readAsText(uploadedFile);
      }
    }
  };

  // Extract keywords from text
  const extractKeywords = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const foundKeywords = new Set<string>();

    // Check all industry keywords
    Object.values(industryKeywords).flat().forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.add(keyword);
      }
    });

    // Extract capitalized words (technologies, tools)
    const capitalizedWords = text.match(/\b[A-Z][a-zA-Z]*(?:\.[a-zA-Z]+)?\b/g) || [];
    capitalizedWords.forEach(word => {
      if (word.length > 2 && !['The', 'And', 'For', 'This', 'That', 'With'].includes(word)) {
        foundKeywords.add(word);
      }
    });

    return Array.from(foundKeywords);
  };

  // Check for quantifiable achievements
  const checkQuantifiableAchievements = (text: string): { found: string[], score: number } => {
    const patterns = [
      /\d+%/g,
      /\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B|K))?/gi,
      /\d+\+?\s*(?:years?|months?)/gi,
      /\d+\+?\s*(?:projects?|clients?|users?|customers?|team\s*members?)/gi,
      /(?:increased|decreased|improved|reduced|grew|saved)\s+(?:by\s+)?\d+/gi,
      /top\s+\d+%?/gi,
      /\d+x/gi,
    ];

    const found: string[] = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      found.push(...matches);
    });

    const score = Math.min(found.length * 5, 20);
    return { found: [...new Set(found)].slice(0, 10), score };
  };

  // Check for action verbs
  const checkActionVerbs = (text: string): { found: string[], score: number } => {
    const lowerText = text.toLowerCase();
    const found = actionVerbs.filter(verb => {
      const regex = new RegExp(`\\b${verb}(?:ed|ing|s)?\\b`, 'i');
      return regex.test(lowerText);
    });

    const score = Math.min(found.length * 2, 15);
    return { found, score };
  };

  // Check resume sections
  const checkSections = (text: string): { found: string[], missing: string[], score: number } => {
    const lowerText = text.toLowerCase();
    const found: string[] = [];
    const missing: string[] = [];

    requiredSections.forEach(section => {
      const hasSection = section.patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
      if (hasSection) {
        found.push(section.name);
      } else {
        missing.push(section.name);
      }
    });

    const score = Math.round((found.length / requiredSections.length) * 20);
    return { found, missing, score };
  };

  // Check contact information
  const checkContactInfo = (text: string): { details: string[], score: number } => {
    const details: string[] = [];
    let score = 0;

    if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) {
      details.push('✓ Email address found');
      score += 5;
    } else {
      details.push('✗ Missing email address');
    }

    if (/(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(text)) {
      details.push('✓ Phone number found');
      score += 5;
    } else {
      details.push('✗ Missing phone number');
    }

    if (/linkedin/i.test(text)) {
      details.push('✓ LinkedIn profile found');
      score += 3;
    } else {
      details.push('○ Consider adding LinkedIn profile');
    }

    if (/(?:city|location|address|based in|located)/i.test(text) || /[A-Z][a-z]+,\s*[A-Z]{2}/.test(text)) {
      details.push('✓ Location information found');
      score += 2;
    }

    return { details, score };
  };

  // Check formatting issues
  const checkFormatting = (text: string): { issues: string[], score: number } => {
    const issues: string[] = [];
    let deductions = 0;

    if (/[│║┃┆┇┊┋╎╏]/.test(text)) {
      issues.push('Special box-drawing characters detected - may cause parsing issues');
      deductions += 5;
    }

    if ((text.match(/[★☆●○◆◇►▶]/g) || []).length > 10) {
      issues.push('Too many decorative symbols - use standard bullets');
      deductions += 3;
    }

    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 150) {
      issues.push(`Resume too short (${wordCount} words) - aim for 400-800 words`);
      deductions += 10;
    } else if (wordCount > 1200) {
      issues.push(`Resume may be too long (${wordCount} words) - consider condensing`);
      deductions += 5;
    }

    const capsHeaders = (text.match(/^[A-Z][A-Z\s]{3,}$/gm) || []).length;
    if (capsHeaders < 3) {
      issues.push('Consider using clear section headers in caps for better parsing');
      deductions += 2;
    }

    const score = Math.max(0, 15 - deductions);
    return { issues, score };
  };

  // Main analysis function
  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    if (analysisMode === 'job' && !jobDescription.trim()) return;

    setIsAnalyzing(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // ─── GENERAL MODE: AI-powered accurate analysis (no regex) ───
    if (analysisMode === 'general') {
      try {
        const res = await fetch(`${API_BASE_URL}/ai/general-ats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText })
        });
        const data = await res.json();

        if (data.success) {
          const d = data.data;
          const cs = d.categoryScores || {};

          const contactDetails = d.contactDetails || {};
          const contactNotes = [
            contactDetails.hasEmail ? '✓ Email found' : '✗ Missing email',
            contactDetails.hasPhone ? '✓ Phone found' : '✗ Missing phone',
            contactDetails.hasLinkedIn ? '✓ LinkedIn found' : '○ Consider adding LinkedIn',
            contactDetails.hasLocation ? '✓ Location found' : '',
            contactDetails.notes || ''
          ].filter(Boolean);

          setResult({
            overallScore: d.overallScore || 0,
            detailedScores: [
              {
                category: 'Contact Information',
                score: cs.contactInfo ?? 0, maxScore: 15,
                icon: <User className="w-4 h-4" />,
                details: contactNotes
              },
              {
                category: 'Resume Structure',
                score: cs.resumeStructure ?? 0, maxScore: 20,
                icon: <ListChecks className="w-4 h-4" />,
                details: [
                  `Found: ${(d.sectionsFound || []).join(', ') || 'None'}`,
                  (d.sectionsMissing || []).length > 0 ? `Missing: ${d.sectionsMissing.join(', ')}` : '✓ All key sections present'
                ]
              },
              {
                category: 'Action Verbs',
                score: cs.actionVerbs ?? 0, maxScore: 15,
                icon: <Zap className="w-4 h-4" />,
                details: [
                  `Found ${(d.actionVerbsFound || []).length} action verbs`,
                  (d.actionVerbsFound || []).length > 0 ? `e.g. ${d.actionVerbsFound.slice(0, 4).join(', ')}` : 'Add: built, developed, led, managed'
                ]
              },
              {
                category: 'Quantifiable Results',
                score: cs.quantifiableResults ?? 0, maxScore: 20,
                icon: <TrendingUp className="w-4 h-4" />,
                details: [
                  `Found: ${(d.quantifiableAchievements || []).join(', ') || 'None detected'}`,
                ]
              },
              {
                category: 'ATS-Friendly Format',
                score: cs.formatting ?? 0, maxScore: 15,
                icon: <FileText className="w-4 h-4" />,
                details: (d.formattingIssues || []).length > 0 ? d.formattingIssues : ['✓ Format is ATS-compatible']
              },
              {
                category: 'Technical Keywords',
                score: cs.keywords ?? 0, maxScore: 15,
                icon: <Briefcase className="w-4 h-4" />,
                details: [`Found: ${(d.technicalKeywords || []).slice(0, 8).join(', ')}`]
              }
            ],
            matchedKeywords: d.technicalKeywords || [],
            missingKeywords: [],
            suggestions: d.suggestions || [],
            strengths: d.strengths || []
          });

          setIsAnalyzing(false);
          return;
        }
      } catch (err: any) {
        console.error('General ATS API error:', err);
        // fall through to local fallback
      }
    }

    // ─── Fallback: local regex analysis ───
    await new Promise(resolve => setTimeout(resolve, 800));
    const resumeLower = resumeText.toLowerCase();
    const detailedScores: DetailedScore[] = [];
    const suggestions: string[] = [];
    const strengths: string[] = [];

    // 1. Contact Information (15 points)
    const contactCheck = checkContactInfo(resumeText);
    detailedScores.push({ category: 'Contact Information', score: contactCheck.score, maxScore: 15, icon: <User className="w-4 h-4" />, details: contactCheck.details });

    // 2. Resume Sections (20 points)
    const sectionCheck = checkSections(resumeText);
    detailedScores.push({ category: 'Resume Structure', score: sectionCheck.score, maxScore: 20, icon: <ListChecks className="w-4 h-4" />, details: [`Found sections: ${sectionCheck.found.join(', ') || 'None'}`, ...(sectionCheck.missing.length > 0 ? [`Missing: ${sectionCheck.missing.join(', ')}`] : [])] });
    if (sectionCheck.missing.length > 0) suggestions.push(`Add missing sections: ${sectionCheck.missing.join(', ')}`);
    else strengths.push('All essential resume sections are present');

    // 3. Action Verbs (15 points)
    const actionCheck = checkActionVerbs(resumeText);
    detailedScores.push({ category: 'Action Verbs', score: actionCheck.score, maxScore: 15, icon: <Zap className="w-4 h-4" />, details: [`Found ${actionCheck.found.length} action verbs`, actionCheck.found.length > 0 ? `Examples: ${actionCheck.found.slice(0, 5).join(', ')}` : 'Add verbs like: achieved, developed, led'] });
    if (actionCheck.found.length < 5) suggestions.push('Use more action verbs');
    else strengths.push(`Strong use of ${actionCheck.found.length} action verbs`);

    // 4. Quantifiable Achievements (20 points)
    const quantCheck = checkQuantifiableAchievements(resumeText);
    detailedScores.push({ category: 'Quantifiable Results', score: quantCheck.score, maxScore: 20, icon: <TrendingUp className="w-4 h-4" />, details: [`Found ${quantCheck.found.length} quantified achievements`, quantCheck.found.length > 0 ? `Examples: ${quantCheck.found.slice(0, 3).join(', ')}` : 'Add metrics like: improved performance by 25%'] });
    if (quantCheck.found.length < 3) suggestions.push('Add more quantifiable achievements');
    else strengths.push(`${quantCheck.found.length} quantified achievements`);

    // 5. Formatting (15 points)
    const formatCheck = checkFormatting(resumeText);
    detailedScores.push({ category: 'ATS-Friendly Format', score: formatCheck.score, maxScore: 15, icon: <FileText className="w-4 h-4" />, details: formatCheck.issues.length > 0 ? formatCheck.issues : ['Resume format is ATS-compatible'] });
    if (formatCheck.issues.length > 0) formatCheck.issues.forEach(i => { if (!i.includes('words')) suggestions.push(i); });
    else strengths.push('Resume format is clean and ATS-friendly');

    let keywordScore = 0;

    let matchedKeywords: string[] = [];
    let missingKeywords: string[] = [];

    // ─── SEMANTIC MODE: Call backend LLM for semantic analysis ───
    if (analysisMode === 'job' && jobDescription.trim()) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE_URL}/ai/semantic-ats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, jobDescription })
        });
        const semanticData = await res.json();

        if (semanticData.success) {
          const d = semanticData.data;
          setSemanticResult(d);

          // Convert semantic result into the display format
          matchedKeywords = [...(d.directMatches || []), ...(d.inferredMatches || [])];
          missingKeywords = d.truelyMissing || [];

          setResult({
            overallScore: d.overallScore || 0,
            detailedScores: [
              {
                category: 'Technical Skills (Semantic)',
                score: d.categoryScores?.technicalSkills || 0,
                maxScore: 40,
                icon: <Target className="w-4 h-4" />,
                details: [
                  `Direct matches: ${(d.directMatches || []).slice(0, 4).join(', ')}`,
                  `Inferred skills: ${(d.inferredMatches || []).slice(0, 4).join(', ')}`,
                ].filter(s => s.length > 20)
              },
              {
                category: 'Experience Relevance',
                score: d.categoryScores?.experienceRelevance || 0,
                maxScore: 30,
                icon: <Briefcase className="w-4 h-4" />,
                details: [d.experienceMatch?.found || 'Checking experience...', `Required: ${d.experienceMatch?.required || 'N/A'}`]
              },
              {
                category: 'Education & Certs',
                score: d.categoryScores?.educationAndCerts || 0,
                maxScore: 15,
                icon: <BookOpen className="w-4 h-4" />,
                details: ['Education relevance assessed semantically']
              },
              {
                category: 'Soft Skills & Culture',
                score: d.categoryScores?.softSkillsAndCulture || 0,
                maxScore: 15,
                icon: <User className="w-4 h-4" />,
                details: ['Communication, teamwork, leadership signals']
              }
            ],
            matchedKeywords: matchedKeywords.slice(0, 15),
            missingKeywords: missingKeywords.slice(0, 10),
            suggestions: (d.suggestions || []).slice(0, 6),
            strengths: (d.strengths || []).slice(0, 5)
          });

          setIsAnalyzing(false);
          return; // Skip the old scoring path
        }
      } catch (err: any) {
        console.error('Semantic ATS error:', err);
        // Fall through to old method on error
      }
    }

    // ─── GENERAL MODE: Original local keyword analysis ───
    const resumeKeywords = extractKeywords(resumeText);
    matchedKeywords = resumeKeywords;
    keywordScore = Math.min(resumeKeywords.length, 15);

    detailedScores.push({
      category: 'Industry Keywords',
      score: keywordScore,
      maxScore: 15,
      icon: <Briefcase className="w-4 h-4" />,
      details: [
        `Found ${resumeKeywords.length} relevant keywords`,
        resumeKeywords.length > 0 ? `Including: ${resumeKeywords.slice(0, 5).join(', ')}` : 'Add industry-specific keywords'
      ]
    });

    if (resumeKeywords.length < 10) {
      suggestions.push('Add more industry-specific keywords and technical skills');
    } else {
      strengths.push(`Good keyword density with ${resumeKeywords.length} relevant terms`);
    }

    const totalScore = detailedScores.reduce((sum, item) => sum + item.score, 0);
    const maxPossibleScore = detailedScores.reduce((sum, item) => sum + item.maxScore, 0);
    const overallScore = Math.round((totalScore / maxPossibleScore) * 100);

    setResult({
      overallScore,
      detailedScores,
      matchedKeywords: [...new Set(matchedKeywords)].slice(0, 15),
      missingKeywords: [...new Set(missingKeywords)].slice(0, 10),
      suggestions: suggestions.slice(0, 8),
      strengths: strengths.slice(0, 5)
    });

    // Also call the older AI analysis for basic skills panel
    try {
      const aiResult = await resumeService.analyzeResume(resumeText, 'Professional');
      if (aiResult.success) setAiAnalysis(aiResult.data);
    } catch (error: any) {
      console.error('AI Analysis failed', error);
    }

    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const resetAnalysis = () => {
    setResult(null);
    setAiAnalysis(null);
    setSemanticResult(null);
    setError(null);
  };

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
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">ATS Score Checker</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Check Your Resume's{' '}
            <span className="gradient-text">ATS Compatibility</span>
          </h1>
          <p className="text-muted-foreground">
            Get a comprehensive analysis of your resume's ATS compatibility.
            Check general compatibility or match against a specific job description.
          </p>
        </motion.div>

        {/* Analysis Mode Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={analysisMode === 'general' ? 'default' : 'outline'}
            onClick={() => setAnalysisMode('general')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            General ATS Check
          </Button>
          <Button
            variant={analysisMode === 'job' ? 'default' : 'outline'}
            onClick={() => setAnalysisMode('job')}
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            Match with Job Description
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Resume Input */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Your Resume
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={inputMode === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputMode('text')}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Paste
                  </Button>
                  <Button
                    variant={inputMode === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputMode('file')}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>

              {inputMode === 'text' ? (
                <Textarea
                  placeholder="Paste your resume content here...

Include all sections: Contact Info, Summary, Experience, Education, Skills"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              ) : (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                    dragActive ? "border-primary bg-primary/5" : "border-border",
                    file && "border-green-500 bg-green-50 dark:bg-green-900/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {resumeText.split(/\s+/).length} words loaded
                      </p>
                      <Button variant="outline" size="sm" onClick={() => { setFile(null); setResumeText(''); }}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground">or click to browse (TXT files)</p>
                      </div>
                      <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          Select File
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Job Description Input - Only show in job mode */}
            {analysisMode === 'job' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Description
                </h3>
                <Textarea
                  placeholder="Paste the job description here to check keyword match...

This helps identify which keywords from the job posting are in your resume."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </motion.div>
            )}

            {/* Analyze Button */}
            <div className="space-y-4">
              <Button
                onClick={() => { setError(null); analyzeResume(); }}
                disabled={!resumeText.trim() || (analysisMode === 'job' && !jobDescription.trim()) || isAnalyzing}
                className="w-full gradient-bg py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* AI Insights - Basic Skills & Advanced Skills (Locked) */}
            {/* AI Insights - Basic Skills & Advanced Skills (Locked) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-8"
            >
              {/* Basic Skills Section - Always Visible */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Basic Skills Found
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {aiAnalysis && aiAnalysis.basicSkillsFound && aiAnalysis.basicSkillsFound.length > 0 ? (
                    aiAnalysis.basicSkillsFound.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {aiAnalysis ? "No basic skills detected." : "Analyze your resume to reveal skills."}
                    </p>
                  )}
                </div>

                {aiAnalysis && aiAnalysis.missingAdvancedSkills && aiAnalysis.missingAdvancedSkills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-amber-600">Consider Adding:</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.missingAdvancedSkills.slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded text-xs">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* Semantic Insight Panel — replaces locked section when semantic analysis ran */}
              {semanticResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-primary/30 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Semantic Analysis Results
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${semanticResult.hiringRecommendation?.includes('Strong') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      semanticResult.hiringRecommendation?.includes('Yes') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        semanticResult.hiringRecommendation?.includes('Maybe') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {semanticResult.hiringRecommendation || 'Analyzing...'}
                    </span>
                  </div>

                  {/* Verdict */}
                  {semanticResult.verdict && (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground italic border-l-4 border-primary">
                      "{semanticResult.verdict}"
                    </div>
                  )}

                  {/* Semantic Matches (the key differentiator) */}
                  {semanticResult.semanticMatches?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">
                        🧠 Inferred Skill Relationships
                      </h4>
                      <div className="space-y-2">
                        {semanticResult.semanticMatches.slice(0, 5).map((m: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="font-medium text-foreground">{m.jobRequirement}</span>
                            <span className="text-muted-foreground">←</span>
                            <span className="text-green-700 dark:text-green-300">{m.resumeEvidence}</span>
                            <span className="ml-auto text-muted-foreground">{m.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Genuinely Missing */}
                  {semanticResult.truelyMissing?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-red-600 dark:text-red-400">
                        ❌ Genuinely Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {semanticResult.truelyMissing.slice(0, 6).map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Original locked section — shown only if no semantic analysis yet */
                <div
                  className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:border-primary/50"
                  onClick={() => setShowSubscription(true)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      Advanced Keywords
                    </h3>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="filter blur-sm select-none opacity-50">
                    <div className="flex flex-wrap gap-2">
                      {['Systems Design', 'Microservices', 'Cloud', 'CI/CD', 'Kubernetes', 'GraphQL'].map((sk, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded-full text-sm">{sk}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="bg-background/80 backdrop-blur-md p-4 rounded-full shadow-lg border border-border">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="mt-3 font-medium bg-background/80 px-3 py-1 rounded-full text-sm">
                      Use "Match with Job Description" for Semantic Analysis
                    </p>
                  </div>
                </div>
              )}

              {/* Premium QR Code Section */}
              {!isPremium && (
                <div
                  className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/payment')}
                >
                  <div className="mb-4 bg-white p-4 rounded-xl inline-block shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/payment')}`}
                      alt="Scan to Pay"
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Scan or Click to Upgrade</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock full AI analysis and premium features instantly
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Subscription Dialog */}
          <Dialog open={showSubscription} onOpenChange={setShowSubscription}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                  <Crown className="w-10 h-10 text-primary" />
                </div>
                <DialogTitle className="text-center text-xl">Upgrade to Premium</DialogTitle>
                <DialogDescription className="text-center">
                  Unlock advanced keyword analysis, industry-specific suggestions, and tailored resume improvements.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Advanced Keyword Gap Analysis</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">AI-Powered Rewrite Suggestions</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Unlimited Resume Scans</span>
                </div>
              </div>
              <Button className="w-full gradient-bg" onClick={() => navigate('/payment')}>
                Upgrade Now - ₹499
              </Button>
            </DialogContent>
          </Dialog>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {result ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">ATS COMPATIBILITY SCORE</h3>
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${result.overallScore * 4.4} 440`}
                        strokeLinecap="round"
                        className={getScoreColor(result.overallScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn("text-4xl font-bold", getScoreColor(result.overallScore))}>
                        {result.overallScore}
                      </span>
                      <span className="text-sm text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                  <p className={cn("text-lg font-semibold", getScoreColor(result.overallScore))}>
                    {getScoreLabel(result.overallScore)}
                  </p>
                  <Button variant="ghost" size="sm" onClick={resetAnalysis} className="mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Another
                  </Button>
                </div>

                {/* Detailed Scores */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="space-y-4">
                    {result.detailedScores.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span className="text-sm font-medium">{item.category}</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {item.score}/{item.maxScore}
                          </span>
                        </div>
                        <Progress
                          value={(item.score / item.maxScore) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {item.details.map((detail, i) => (
                            <p key={i}>{detail}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                {result.strengths.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                      Suggestions for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-amber-500 mt-0.5">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {(result.matchedKeywords.length > 0 || result.missingKeywords.length > 0) && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Keyword Analysis</h3>

                    {result.matchedKeywords.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                          ✓ Keywords Found ({result.matchedKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedKeywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                          ✗ Consider Adding ({result.missingKeywords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.missingKeywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <Target className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {analysisMode === 'general'
                    ? "Paste your resume to get a comprehensive ATS compatibility analysis with actionable suggestions."
                    : "Paste your resume and job description to see how well they match and get keyword recommendations."}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Format Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Section Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Keyword Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Action Verbs</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">ATS Optimization Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Use Standard Formatting</h3>
              <p className="text-sm text-muted-foreground">
                Stick to common fonts, avoid tables/graphics, and use standard section headers.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Match Job Keywords</h3>
              <p className="text-sm text-muted-foreground">
                Include exact keywords from the job description naturally in your resume.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quantify Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Use numbers and metrics to demonstrate your impact (e.g., "Increased sales by 30%").
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ATSChecker;
