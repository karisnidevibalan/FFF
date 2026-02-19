import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Lightbulb,
  Zap,
  Loader2,
  BrainCircuit,
  User,
  Bot,
  Wand2,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiService } from '@/services/aiService';
import AIFloatingActions from './AIFloatingActions';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const faqs = [
  {
    question: "How can I make my resume ATS-friendly?",
    answer: "To make your resume ATS-friendly, use a simple layout, include industry-specific keywords, use standard fonts like Arial or Calibri, and avoid images or complex graphics in your text."
  },
  {
    question: "What should I include in my professional summary?",
    answer: "Your summary should be 3-5 lines highlighting your years of experience, key skills, and major achievements. Use quantifiable metrics whenever possible (e.g., 'Increased sales by 20%')."
  },
  {
    question: "How do I choose the best resume template?",
    answer: "Choose a template based on your industry. Creative roles benefit from 'Orbit' or 'Creative', while corporate roles should stick to 'Executive' or 'Classic' for a professional look."
  },
  {
    question: "Should I include my full address on my resume?",
    answer: "Modern resumes typically only require your City and State. For privacy reasons, your full street address is usually not necessary unless explicitly requested."
  }
];

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Career Partner. I can answer your FAQs, help you refine resume text, or suggest new skills. What would you like to start with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, showFaqs]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowFaqs(false);

    try {
      const response = await aiService.improveContent(textToSend, 'general inquiry');

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error("Failed to get AI response. Please check your connection.");
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting to my brain right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionId: string) => {
    setIsOpen(true);
    if (actionId === 'faq') {
      setShowFaqs(true);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: "Here are some frequently asked questions. Click on any to see the answer:",
        timestamp: new Date()
      }]);
    } else if (actionId === 'other') {
      setShowFaqs(false);
      setMessages([{
        id: '1',
        type: 'ai',
        content: "I've loaded specialized tools for you. What would you like to do?",
        timestamp: new Date()
      }]);
    } else {
      let query = "";
      switch (actionId) {
        case 'refine':
          query = "Can you help me refine the selected text for my resume?";
          break;
        case 'suggest':
          query = "What skills should I add to my resume for better ATS performance?";
          break;
        case 'improve':
          query = "Generate an improved version of my summary.";
          break;
        default:
          return;
      }
      handleSend(query);
    }
  };

  const handleFaqClick = (faq: { question: string; answer: string }) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: faq.question,
      timestamp: new Date()
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: faq.answer,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setShowFaqs(false);
  };

  return (
    <>
      <AIFloatingActions
        onAction={handleAction}
        isChatOpen={isOpen}
        onToggleChat={() => setIsOpen(!isOpen)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-140px)] glass-effect rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 gradient-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-tight">AI Career Partner</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-[10px] text-white/80 uppercase font-bold tracking-wider">Precision Active</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                      {message.type === 'user' ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-secondary" />}
                    </div>
                    <div
                      className={`relative group max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted/50 backdrop-blur-sm border border-border/50 text-foreground rounded-tl-none'
                        }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <span className={`text-[9px] opacity-40 mt-2 block ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {showFaqs && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-2 pl-11"
                  >
                    {faqs.map((faq, i) => (
                      <button
                        key={i}
                        onClick={() => handleFaqClick(faq)}
                        className="text-left p-3 rounded-xl bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors text-xs font-medium text-foreground/80"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-border/50">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {messages.length <= 1 && !isLoading && !showFaqs && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-2 mt-4"
                  >
                    <button
                      onClick={() => handleAction('faq')}
                      className="p-3 text-left rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group col-span-2"
                    >
                      <HelpCircle className="w-4 h-4 text-emerald-500 mb-2" />
                      <p className="text-xs font-semibold text-emerald-700">Browse FAQs</p>
                      <p className="text-[10px] text-emerald-600/70">Get quick answers to common questions</p>
                    </button>
                    <button
                      onClick={() => handleAction('refine')}
                      className="p-3 text-left rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                    >
                      <Wand2 className="w-4 h-4 text-blue-500 mb-2" />
                      <p className="text-xs font-semibold text-blue-700">Refine Selection</p>
                      <p className="text-[10px] text-blue-600/70">Polish your text</p>
                    </button>
                    <button
                      onClick={() => handleAction('suggest')}
                      className="p-3 text-left rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500 mb-2" />
                      <p className="text-xs font-semibold text-amber-700">AI Suggestions</p>
                      <p className="text-[10px] text-amber-600/70">Get new ideas</p>
                    </button>
                    <button
                      onClick={() => handleAction('improve')}
                      className="p-3 text-left rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all col-span-2"
                    >
                      <Zap className="w-4 h-4 text-purple-500 mb-2" />
                      <p className="text-xs font-semibold text-purple-700">Instant Improve</p>
                      <p className="text-[10px] text-purple-600/70">Level up your whole summary</p>
                    </button>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
              <div className="flex gap-2 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for resume precision..."
                  className="flex-1 pr-12 bg-muted/30 border-primary/10 focus-visible:ring-primary/30"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 gradient-bg shadow-lg hover:shadow-primary/20"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-[10px] text-center mt-3 text-muted-foreground font-medium">
                AI can provide precise details for your career growth.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
