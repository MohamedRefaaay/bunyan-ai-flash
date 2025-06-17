
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateFlashcardsFromContent } from '@/utils/aiProviders';
import FlashcardPreviewModal from '@/components/flashcards/FlashcardPreviewModal';
import type { Flashcard } from '@/types/flashcard';

interface YouTubeFlashcardsButtonProps {
  content: string;
  title?: string;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  disabled?: boolean;
}

const YouTubeFlashcardsButton: React.FC<YouTubeFlashcardsButtonProps> = ({
  content,
  title = '',
  onFlashcardsGenerated,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewFlashcards, setPreviewFlashcards] = useState<Flashcard[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateCards = async () => {
    if (!content.trim()) {
      toast.error('لا يوجد محتوى لإنشاء البطاقات منه');
      return;
    }

    setIsGenerating(true);

    try {
      const flashcards = await generateFlashcardsFromContent(
        content,
        'youtube',
        title,
        8
      );

      setPreviewFlashcards(flashcards);
      setShowPreview(true);
      toast.success(`تم إنشاء ${flashcards.length} بطاقة تعليمية من الفيديو!`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في إنشاء البطاقات');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportFlashcards = () => {
    onFlashcardsGenerated(previewFlashcards);
    setShowPreview(false);
    toast.success('تم تصدير البطاقات بنجاح!');
  };

  const handleEditCard = (card: Flashcard) => {
    console.log('Edit card:', card);
  };

  return (
    <>
      <Button
        onClick={handleGenerateCards}
        disabled={disabled || isGenerating || !content.trim()}
        className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
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
            🎯 مولد البطاقات من الفيديو
          </>
        )}
      </Button>

      <FlashcardPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        flashcards={previewFlashcards}
        onExport={handleExportFlashcards}
        onEdit={handleEditCard}
      />
    </>
  );
};

export default YouTubeFlashcardsButton;
