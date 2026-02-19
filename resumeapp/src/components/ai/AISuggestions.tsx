import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

interface AISuggestionsProps {
  section: 'summary' | 'experience' | 'skills' | 'achievements';
  currentContent?: string;
  jobTitle?: string;
  onApplySuggestion?: (suggestion: string) => void;
  experiences?: any[];
  skills?: string[];
}

// Quick improvement suggestions
const quickImprovements = [
  { icon: Target, text: 'Add quantifiable metrics (%, $, numbers)' },
  { icon: TrendingUp, text: 'Start with strong action verbs' },
  { icon: Lightbulb, text: 'Highlight unique achievements' },
  { icon: FileText, text: 'Keep bullets concise (1-2 lines)' },
];

const actionVerbs = [
  'Achieved', 'Built', 'Created', 'Delivered', 'Engineered',
  'Facilitated', 'Generated', 'Improved', 'Led', 'Managed',
  'Optimized', 'Pioneered', 'Reduced', 'Spearheaded', 'Transformed',
];

const AISuggestions: React.FC<AISuggestionsProps> = ({
  section,
  currentContent = '',
  jobTitle = '',
  onApplySuggestion,
  experiences,
  skills,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showActionVerbs, setShowActionVerbs] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let result = '';
      if (section === 'summary') {
        result = await aiService.generateSummary(experiences || [], skills || [], jobTitle || 'Professional');
      } else if (section === 'skills') {
        const skillsResult = await aiService.suggestSkills(jobTitle || 'Professional', skills || []);
        result = Array.isArray(skillsResult) ? skillsResult.join(', ') : skillsResult;
      } else {
        result = await aiService.improveContent(currentContent, section, jobTitle || 'Professional');
      }
      setSuggestion(result);
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
      toast.error('AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplySuggestion && suggestion) {
      onApplySuggestion(suggestion);
    }
  };

  const sectionLabels: Record<string, string> = {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    skills: 'Skills',
    achievements: 'Achievements',
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Suggestions for {sectionLabels[section]}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Quick Tips */}
            <div className="grid grid-cols-2 gap-2">
              {quickImprovements.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-background/50"
                >
                  <tip.icon className="w-3 h-3 text-primary" />
                  <span>{tip.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gap-2"
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate AI Suggestion
                </>
              )}
            </Button>

            {/* Action Verbs */}
            <Collapsible open={showActionVerbs} onOpenChange={setShowActionVerbs}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  {showActionVerbs ? 'Hide' : 'Show'} Power Action Verbs
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 mt-2">
                  {actionVerbs.map((verb) => (
                    <span
                      key={verb}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => navigator.clipboard.writeText(verb)}
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Generated Suggestion */}
            <AnimatePresence>
              {suggestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <Textarea
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      rows={6}
                      className="pr-10 text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setSuggestion('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleApply}
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Check className="w-3 h-3" />
                      Apply
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AISuggestions;
