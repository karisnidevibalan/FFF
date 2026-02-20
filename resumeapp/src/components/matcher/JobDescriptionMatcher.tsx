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
  Award,
  Zap,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useResume } from '@/contexts/ResumeContext';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface MatchResult {
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  experienceAnalysis: {
    required: string;
    candidateHas: string;
    match: boolean;
    comment?: string;
  };
  educationAnalysis: {
    required: string;
    candidateHas: string;
    match: boolean;
  };
  suggestions: string[];
  strengths: string[];
  overallVerdict: string;
}

interface JobDescriptionMatcherProps {
  className?: string;
}

const JobDescriptionMatcher: React.FC<JobDescriptionMatcherProps> = ({
  className = '',
}) => {
  const { resumeData } = useResume();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Error", description: "Please enter a job description", variant: "destructive" });
      return;
    }

    if (jobDescription.length < 50) {
      toast({ title: "Error", description: "Job description is too short. Add more details.", variant: "destructive" });
      return;
    }

    // Check if resume has data
    const hasResumeData = resumeData.skills?.length > 0 ||
      resumeData.experience?.length > 0 ||
      resumeData.personalInfo?.summary;

    if (!hasResumeData) {
      toast({
        title: "No Resume Data",
        description: "Please build your resume first in the Builder page",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/ai/match-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobDescription,
          resumeData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
        toast({ title: "Analysis Complete", description: `Match Score: ${data.result.overallScore}%` });
      } else {
        throw new Error(data.message || 'Failed to analyze');
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not connect to AI service",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-400';
    if (score >= 60) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-orange-400';
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
              <div className={`bg-gradient-to-r ${getScoreGradient(result.overallScore)} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-sm opacity-90 mb-1">Match Score</p>
                    <p className="text-6xl font-bold">
                      {result.overallScore}%
                    </p>
                    <p className="text-sm mt-2 opacity-90">{getScoreLabel(result.overallScore)}</p>
                  </div>
                  <div className="w-32 h-32 relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.overallScore * 3.52} 352`}
                      />
                    </svg>
                    <Award className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                  </div>
                </div>
                {result.overallVerdict && (
                  <p className="text-white/90 text-sm mt-4 pt-4 border-t border-white/20">
                    <Zap className="w-4 h-4 inline mr-2" />
                    {result.overallVerdict}
                  </p>
                )}
              </div>
            </Card>

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                    <ThumbsUp className="w-5 h-5" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills Match */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Matched Skills */}
                {result.matchedSkills && result.matchedSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Matched Skills ({result.matchedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.map((skill) => (
                        <Badge key={skill} variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {result.missingSkills && result.missingSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      Missing Skills ({result.missingSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-red-200 text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => {
                            navigator.clipboard.writeText(skill);
                            toast({ title: "Copied!", description: `"${skill}" copied to clipboard` });
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Click on a skill to copy it to your clipboard
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
                {/* Experience */}
                {result.experienceAnalysis && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {result.experienceAnalysis.match ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">Experience</p>
                        <p className="text-xs text-muted-foreground">
                          Required: {result.experienceAnalysis.required}
                        </p>
                        {result.experienceAnalysis.comment && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.experienceAnalysis.comment}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={result.experienceAnalysis.match ? 'default' : 'secondary'}>
                      {result.experienceAnalysis.candidateHas}
                    </Badge>
                  </div>
                )}

                {/* Education */}
                {result.educationAnalysis && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {result.educationAnalysis.match ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">Education</p>
                        <p className="text-xs text-muted-foreground">
                          Required: {result.educationAnalysis.required}
                        </p>
                      </div>
                    </div>
                    <Badge variant={result.educationAnalysis.match ? 'default' : 'secondary'}>
                      {result.educationAnalysis.candidateHas}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Suggestions to Improve
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
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                Try Another JD
              </Button>
              <Button className="flex-1 gap-2" onClick={() => window.location.href = '/builder'}>
                <FileText className="w-4 h-4" />
                Edit Resume
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDescriptionMatcher;
