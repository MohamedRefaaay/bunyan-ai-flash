
import { useState } from 'react';
import type { Flashcard } from '@/types/flashcard';

export const useDashboardState = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleFeatureChange = (feature: string | null) => {
    setActiveFeature(feature);
    if (feature === 'document-analyzer' || feature === 'youtube' || feature === 'upload' || feature === null) {
      setTranscript('');
      setSessionId(null);
    }
  };

  return {
    activeFeature,
    transcript,
    flashcards,
    isProcessing,
    selectedCard,
    showAnalytics,
    showEditor,
    sessionId,
    setActiveFeature,
    setTranscript,
    setFlashcards,
    setIsProcessing,
    setSelectedCard,
    setShowAnalytics,
    setShowEditor,
    setSessionId,
    handleFeatureChange
  };
};
