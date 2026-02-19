import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  onAppend?: boolean; // If true, append to existing value
  currentValue?: string;
  className?: string;
  language?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

// Check if speech recognition is supported
const isSpeechRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onAppend = false,
  currentValue = '',
  className = '',
  language = 'en-US',
  size = 'icon',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const results = event.results;
        const transcript = results[results.length - 1][0].transcript;
        const isFinal = results[results.length - 1].isFinal;

        if (isFinal) {
          // Capitalize first letter and add proper punctuation
          let processedText = transcript.trim();
          processedText = processedText.charAt(0).toUpperCase() + processedText.slice(1);
          
          if (onAppend && currentValue) {
            // Append to existing value with space
            const separator = currentValue.endsWith('.') || currentValue.endsWith('!') || currentValue.endsWith('?') ? ' ' : '. ';
            onResult(currentValue + separator + processedText);
          } else {
            onResult(processedText);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permission and try again.');
        } else if (event.error === 'no-speech') {
          // User didn't say anything, just stop silently
        } else if (event.error === 'network') {
          alert('Network error. Please check your internet connection.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsListening(false);
      alert('Failed to start voice input. Please try again.');
    }
  }, [language, onResult, onAppend, currentValue]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isListening ? 'default' : 'outline'}
      size={size}
      onClick={toggleListening}
      className={cn(
        'transition-all duration-200',
        isListening && 'bg-red-500 hover:bg-red-600 text-white animate-pulse',
        className
      )}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <Mic className="w-4 h-4" />
      ) : (
        <MicOff className="w-4 h-4" />
      )}
    </Button>
  );
};

// Hook version for more flexibility
export const useVoiceInput = (language = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported = isSpeechRecognitionSupported();

  const startListening = useCallback((onResult?: (text: string) => void) => {
    if (!isSupported) {
      setError('Voice input not supported');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const results = event.results;
        const text = results[results.length - 1][0].transcript;
        const isFinal = results[results.length - 1].isFinal;

        setTranscript(text);
        
        if (isFinal && onResult) {
          onResult(text.trim());
        }
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (err) {
      setError('Failed to start');
      setIsListening(false);
    }
  }, [isSupported, language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
};

export default VoiceInput;
