
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, Loader2, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { generateFlashcardsFromContent } from '@/utils/aiProviders';
import { exportToAnki } from '@/utils/ankiExporter';
import type { Flashcard } from '@/types/flashcard';

interface FlashcardGeneratorButtonProps {
  content: string;
  title?: string;
  sourceType: 'document' | 'youtube' | 'audio' | 'visual' | 'custom';
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  disabled?: boolean;
  cardCount?: number;
  className?: string;
  existingFlashcards?: Flashcard[];
}

const FlashcardGeneratorButton: React.FC<FlashcardGeneratorButtonProps> = ({
  content,
  title = '',
  sourceType,
  onFlashcardsGenerated,
  disabled = false,
  cardCount = 8,
  className = '',
  existingFlashcards = []
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
      toast.success(`تم إنشاء ${flashcards.length} بطاقة تعليمية بنجاح بواسطة Gemini!`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في إنشاء البطاقات');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToAnki = async () => {
    if (!existingFlashcards || existingFlashcards.length === 0) {
      toast.error('لا توجد بطاقات للتصدير');
      return;
    }

    setIsExporting(true);

    try {
      await exportToAnki(existingFlashcards, title || 'Bunyan AI Cards');
      toast.success(`تم تصدير ${existingFlashcards.length} بطاقة إلى Anki بنجاح!`);
    } catch (error) {
      console.error('Error exporting to Anki:', error);
      toast.error('حدث خطأ في تصدير البطاقات');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleGenerateCards}
        disabled={disabled || isGenerating || !content.trim()}
        className={`gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg ${className}`}
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            جاري إنشاء البطاقات بواسطة Gemini...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            🎯 مولد البطاقات بـ Gemini
          </>
        )}
      </Button>

      {existingFlashcards && existingFlashcards.length > 0 && (
        <Button
          onClick={handleExportToAnki}
          disabled={isExporting}
          variant="outline"
          className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري التصدير...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              تصدير إلى Anki ({existingFlashcards.length} بطاقة)
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FlashcardGeneratorButton;
