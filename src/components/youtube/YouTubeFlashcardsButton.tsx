
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';

export interface YouTubeFlashcardsButtonProps {
  onGenerate: () => Promise<void>;
  isProcessing?: boolean;
  disabled?: boolean;
}

const YouTubeFlashcardsButton = ({ 
  onGenerate,
  isProcessing = false, 
  disabled = false 
}: YouTubeFlashcardsButtonProps) => {
  return (
    <Button
      onClick={onGenerate}
      disabled={disabled || isProcessing}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري إنشاء البطاقات...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          🎯 مولد البطاقات
        </>
      )}
    </Button>
  );
};

export default YouTubeFlashcardsButton;
