
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';

interface YouTubeFlashcardsButtonProps {
  onGenerate: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const YouTubeFlashcardsButton: React.FC<YouTubeFlashcardsButtonProps> = ({
  onGenerate,
  isProcessing,
  disabled
}) => (
  <Button
    onClick={onGenerate}
    disabled={disabled}
    className="w-full gap-2 bg-red-600 hover:bg-red-700"
    size="lg"
  >
    {isProcessing ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        جاري إنشاء البطاقات...
      </>
    ) : (
      <>
        <BookOpen className="h-5 w-5" />
        إنشاء بطاقات تعليمية من الفيديو
      </>
    )}
  </Button>
);

export default YouTubeFlashcardsButton;
