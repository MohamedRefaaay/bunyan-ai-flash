
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateFlashcardsFromContent } from '@/utils/aiProviders';
import type { Flashcard } from '@/types/flashcard';

interface FlashcardGeneratorButtonProps {
  content: string;
  title?: string;
  sourceType: 'document' | 'youtube' | 'audio' | 'visual' | 'custom';
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  disabled?: boolean;
  cardCount?: number;
  className?: string;
}

const FlashcardGeneratorButton: React.FC<FlashcardGeneratorButtonProps> = ({
  content,
  title = '',
  sourceType,
  onFlashcardsGenerated,
  disabled = false,
  cardCount = 8,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCards = async () => {
    if (!content.trim()) {
      toast.error('لا يوجد محتوى لإنشاء البطاقات منه');
      return;
    }

    setIsGenerating(true);

    try {
      const flashcards = await generateFlashcardsFromContent(
        content,
        sourceType,
        title,
        cardCount
      );

      onFlashcardsGenerated(flashcards);
      toast.success(`تم إنشاء ${flashcards.length} بطاقة تعليمية بنجاح!`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في إنشاء البطاقات');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateCards}
      disabled={disabled || isGenerating || !content.trim()}
      className={`gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg ${className}`}
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          جاري إنشاء البطاقات...
        </>
      ) : (
        <>
          <Target className="h-5 w-5" />
          🎯 مولد البطاقات
        </>
      )}
    </Button>
  );
};

export default FlashcardGeneratorButton;
