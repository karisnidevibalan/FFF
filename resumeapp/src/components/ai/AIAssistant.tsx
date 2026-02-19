import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

const suggestions = [
  { icon: Lightbulb, text: 'Suggest action verbs', category: 'writing' },
  { icon: Zap, text: 'Improve my summary', category: 'improvement' },
  { icon: Sparkles, text: 'Quantify achievements', category: 'impact' },
];

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI resume assistant. I can help you write better bullet points, suggest action verbs, and optimize your resume for ATS. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(input),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('action verb')) {
      return "Here are powerful action verbs for your resume:\n\n• Led, Spearheaded, Orchestrated\n• Implemented, Developed, Engineered\n• Optimized, Streamlined, Enhanced\n• Achieved, Exceeded, Delivered\n• Collaborated, Mentored, Facilitated";
    }
    
    if (lowerQuery.includes('summary') || lowerQuery.includes('objective')) {
      return "For a strong summary, include:\n\n1. Your professional title\n2. Years of experience\n3. Key skills (2-3)\n4. Notable achievement\n5. What you bring to the role\n\nExample: 'Results-driven Software Engineer with 5+ years of experience in full-stack development. Expert in React and Node.js with a track record of reducing load times by 40%.'";
    }
    
    if (lowerQuery.includes('quantify') || lowerQuery.includes('number')) {
      return "Quantify your achievements with:\n\n• Percentages: 'Increased sales by 25%'\n• Dollar amounts: 'Managed $500K budget'\n• Time saved: 'Reduced processing time by 3 hours/week'\n• Team size: 'Led team of 8 developers'\n• Scale: 'Served 10,000+ daily users'";
    }

    return "I can help you with:\n\n• Writing impactful bullet points\n• Suggesting action verbs\n• Quantifying achievements\n• ATS optimization tips\n• Template recommendations\n\nWhat would you like to improve?";
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full gradient-bg shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border gradient-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
                    <p className="text-xs text-primary-foreground/70">Powered by Resumify</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestion(suggestion.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  >
                    <suggestion.icon className="w-3 h-3" />
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" className="gradient-bg">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
