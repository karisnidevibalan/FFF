import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  FileText,
  Loader2,
  Copy,
  Plus,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface MatchResult {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  experienceMatch: {
    yearsRequired: string;
    yearsHave: string;
    matched: boolean;
  };
  educationMatch: {
    required: string;
    have: string;
    matched: boolean;
  };
}

interface JobDescriptionMatcherProps {
  resumeData?: any;
  className?: string;
}

// Extract keywords from job description
const extractKeywords = (text: string): string[] => {
  const commonSkills = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'sql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'html', 'css', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest api',
    'machine learning', 'data analysis', 'project management', 'communication',
    'leadership', 'problem solving', 'teamwork', 'ci/cd', 'testing', 'devops'
  ];

  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => lowerText.includes(skill));
};

// Analyze job description
const analyzeJobDescription = async (
  jobDescription: string,
  resumeData: any
): Promise<MatchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const jdKeywords = extractKeywords(jobDescription);
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  const matchedKeywords = jdKeywords.filter(kw => resumeText.includes(kw));
  const missingKeywords = jdKeywords.filter(kw => !resumeText.includes(kw));

  // Calculate scores
  const keywordScore = jdKeywords.length > 0 
    ? (matchedKeywords.length / jdKeywords.length) * 100 
    : 50;

  // Extract years of experience requirement
  const yearsMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
  const yearsRequired = yearsMatch ? yearsMatch[1] : '0';

  // Generate suggestions
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these skills to your resume: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (!resumeText.includes('quantif') && !resumeText.includes('achiev')) {
    suggestions.push('Add quantifiable achievements (%, $, numbers) to stand out');
  }
  if (keywordScore < 70) {
    suggestions.push('Consider tailoring your experience descriptions to match the job requirements');
  }
  suggestions.push('Use action verbs like "Led", "Developed", "Implemented" in your experience');

  return {
    overallScore: Math.round(keywordScore),
    matchedKeywords,
    missingKeywords,
    suggestions,
    skillsMatch: {
      matched: matchedKeywords,
      missing: missingKeywords,
      percentage: Math.round(keywordScore),
    },
    experienceMatch: {
      yearsRequired: `${yearsRequired}+ years`,
      yearsHave: '3+ years', // Would calculate from resume
      matched: parseInt(yearsRequired) <= 3,
    },
    educationMatch: {
      required: "Bachelor's degree",
      have: "Bachelor's degree",
      matched: true,
    },
  };
};

const JobDescriptionMatcher: React.FC<JobDescriptionMatcherProps> = ({
  resumeData,
  className = '',
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const matchResult = await analyzeJobDescription(jobDescription, resumeData);
      setResult(matchResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Job Description Matcher
          </CardTitle>
          <CardDescription>
            Paste a job description to see how well your resume matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate should have strong problem-solving skills and experience with agile methodologies..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Overall Score */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Match Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}%
                    </p>
                    <p className="text-sm mt-1">{getScoreLabel(result.overallScore)}</p>
                  </div>
                  <div className="w-32 h-32 relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.overallScore * 3.52} 352`}
                        className={getScoreColor(result.overallScore)}
                      />
                    </svg>
                    <Award className={`w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getScoreColor(result.overallScore)}`} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills Match */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Skills Match</span>
                  <span className="font-medium">{result.skillsMatch.percentage}%</span>
                </div>
                <Progress value={result.skillsMatch.percentage} className="h-3" />

                {/* Matched Keywords */}
                {result.matchedKeywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Matched Keywords ({result.matchedKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {result.missingKeywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      Missing Keywords ({result.missingKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword) => (
                        <Badge 
                          key={keyword} 
                          variant="outline" 
                          className="border-red-200 text-red-600 cursor-pointer hover:bg-red-50"
                          onClick={() => navigator.clipboard.writeText(keyword)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click on a keyword to copy it
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements Match */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requirements Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {result.experienceMatch.matched ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Experience</p>
                      <p className="text-xs text-muted-foreground">
                        Required: {result.experienceMatch.yearsRequired}
                      </p>
                    </div>
                  </div>
                  <Badge variant={result.experienceMatch.matched ? 'default' : 'secondary'}>
                    {result.experienceMatch.yearsHave}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {result.educationMatch.matched ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Education</p>
                      <p className="text-xs text-muted-foreground">
                        Required: {result.educationMatch.required}
                      </p>
                    </div>
                  </div>
                  <Badge variant={result.educationMatch.matched ? 'default' : 'secondary'}>
                    {result.educationMatch.have}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm">{suggestion}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                Try Another JD
              </Button>
              <Button className="flex-1 gap-2">
                <FileText className="w-4 h-4" />
                Optimize Resume
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDescriptionMatcher;
