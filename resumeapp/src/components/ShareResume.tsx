import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  Check, 
  Mail, 
  Linkedin, 
  Twitter, 
  X,
  Link as LinkIcon,
  QrCode,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShareResumeProps {
  resumeId?: string;
  resumeName?: string;
}

const ShareResume: React.FC<ShareResumeProps> = ({ 
  resumeId = 'demo-resume', 
  resumeName = 'My Resume' 
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate share URL (in real app, this would be from backend)
  const shareUrl = `${window.location.origin}/share/${resumeId}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500',
      action: () => {
        window.open(`mailto:?subject=Check out my resume - ${resumeName}&body=View my resume here: ${shareUrl}`);
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out my resume!&url=${encodeURIComponent(shareUrl)}`);
      }
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Resume
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Share Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={shareUrl}
                  readOnly
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="shrink-0"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Social Share Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Share via
            </label>
            <div className="flex gap-3">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={option.action}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl ${option.color} text-white hover:opacity-90 transition-opacity`}
                >
                  <option.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{option.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              QR Code
            </label>
            <div className="flex items-center justify-center p-6 bg-white rounded-xl border-2 border-dashed border-muted">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan to view resume on mobile
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> Anyone with the link can view your resume. 
              You can disable sharing anytime from your dashboard.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResume;
