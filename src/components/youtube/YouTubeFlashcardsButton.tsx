
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';

export interface YouTubeFlashcardsButtonProps {
  content: string;
  title: string;
  onFlashcardsGenerated: (flashcards: any[]) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

const YouTubeFlashcardsButton = ({ 
  content, 
  title, 
  onFlashcardsGenerated, 
  isProcessing = false, 
  disabled = false 
}: YouTubeFlashcardsButtonProps) => {
  const handleGenerate = async () => {
    if (!content.trim()) return;

    try {
      // Here you would integrate with Gemini API
      console.log('Generating flashcards for YouTube content:', { title, content });
      
      // Mock flashcards for now
      const mockFlashcards = [
        {
          id: '1',
          front: `سؤال حول: ${title}`,
          back: 'إجابة مولدة من محتوى الفيديو',
          difficulty: 'medium' as const,
          tags: ['youtube', 'video'],
          signature: '📘 صنع بواسطة Bunyan_AI'
        }
      ];
      
      onFlashcardsGenerated(mockFlashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={disabled || isProcessing || !content.trim()}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
