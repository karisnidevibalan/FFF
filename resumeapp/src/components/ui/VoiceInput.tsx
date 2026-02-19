import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  inputType?: string;
  rows?: number;
  className?: string;
  append?: boolean; // For textarea - append instead of replace
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'input',
  inputType = 'text',
  rows = 4,
  className,
  append = false,
}) => {
  const [isListening, setIsListening] = useState(false);

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice not supported. Use Chrome/Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let text = event.results[0][0].transcript.trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);
      
      if (append && value) {
        const sep = value.endsWith('.') ? ' ' : '. ';
        onChange(value + sep + text);
      } else {
        onChange(text);
      }
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      if (e.error === 'not-allowed') alert('Mic permission denied');
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="flex gap-2">
      <InputComponent
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={inputType}
        rows={type === 'textarea' ? rows : undefined}
        className={cn('flex-1', className)}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={startVoice}
        className={cn(
          'shrink-0 transition-colors',
          isListening && 'bg-red-500 text-white border-red-500 animate-pulse'
        )}
        title="Click to speak"
      >
        <Mic className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default VoiceInput;
