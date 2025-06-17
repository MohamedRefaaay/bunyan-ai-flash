
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActionCards from '@/components/dashboard/ActionCards';
import FeatureRenderer from '@/components/dashboard/FeatureRenderer';
import { Separator } from '@/components/ui/separator';
import { useDashboardState } from '@/hooks/useDashboardState';
import { 
  createFileSession,
  updateSessionTranscript,
  createDocumentSession,
  createYouTubeSession,
  saveFlashcards,
  updateFlashcard
} from '@/utils/dashboardHandlers';
import { toast } from 'sonner';
import type { Flashcard } from '@/types/flashcard';

const Dashboard = () => {
  const {
    activeFeature,
    transcript,
    flashcards,
    isProcessing,
    selectedCard,
    showAnalytics,
    showEditor,
    sessionId,
    setTranscript,
    setFlashcards,
    setIsProcessing,
    setSelectedCard,
    setShowAnalytics,
    setShowEditor,
    setSessionId,
    handleFeatureChange
  } = useDashboardState();

  const handleFileUpload = async (file: File) => {
    console.log('File uploaded:', file.name);
    setTranscript('');
    setFlashcards([]);
    const newSessionId = await createFileSession(file.name);
    setSessionId(newSessionId);
  };

  const handleTranscriptGenerated = async (newTranscript: string) => {
    setTranscript(newTranscript);
    if (sessionId) {
      await updateSessionTranscript(sessionId, newTranscript);
    }
  };

  const handleDocumentProcessed = async (content: string, name: string) => {
    setTranscript(content);
    setFlashcards([]);
    const newSessionId = await createDocumentSession(content, name);
    setSessionId(newSessionId);
  };

  const handleYouTubeProcessed = async (title: string, url: string, transcript: string, summary: string) => {
    setTranscript(transcript);
    setFlashcards([]);
    const newSessionId = await createYouTubeSession(title, url, transcript, summary);
    setSessionId(newSessionId);
  };

  const handleFlashcardsGenerated = async (newFlashcards: Flashcard[]) => {
    if (sessionId) {
      const savedFlashcards = await saveFlashcards(newFlashcards, sessionId);
      if (savedFlashcards) {
        setFlashcards((prev) => [...prev, ...savedFlashcards]);
      }
    } else {
      setFlashcards(newFlashcards);
      toast.warning("تم إنشاء البطاقات ولكن لم يتم العثور على جلسة لحفظها.");
    }
  };

  const handleSummaryGenerated = (summary: string, keyPoints: string[]) => {
    console.log('Summary generated:', summary);
    console.log('Key points:', keyPoints);
  };

  const handleCardEdit = (card: Flashcard) => {
    setSelectedCard(card);
    setShowEditor(true);
  };

  const handleCardUpdate = async (updatedCard: Flashcard) => {
    const success = await updateFlashcard(updatedCard);
    if (success) {
      setFlashcards(prev => 
        prev.map(card => card.id === updatedCard.id ? updatedCard : card)
      );
      setShowEditor(false);
      setSelectedCard(null);
    }
  };

  const handleStyleChange = (styles: any) => {
    console.log('Style changed:', styles);
  };

  const handleRecommendationsApply = (recommendations: any) => {
    console.log('Recommendations applied:', recommendations);
  };

  const handleVisualCardsGenerated = (visualCards: Flashcard[]) => {
    setFlashcards(prev => [...prev, ...visualCards]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 w-full">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        <div className="w-full max-w-full">
          <DashboardHeader />
          <DashboardStats flashcards={flashcards} />
          
          {activeFeature ? (
            <div className="mb-6 lg:mb-8">
              <Separator className="mb-4 lg:mb-6" />
              <div className="w-full max-w-full overflow-hidden">
                <FeatureRenderer
                  activeFeature={activeFeature}
                  transcript={transcript}
                  flashcards={flashcards}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  selectedCard={selectedCard}
                  showEditor={showEditor}
                  showAnalytics={showAnalytics}
                  sessionId={sessionId}
                  onFileUpload={handleFileUpload}
                  onTranscriptGenerated={handleTranscriptGenerated}
                  onDocumentProcessed={handleDocumentProcessed}
                  onYouTubeProcessed={handleYouTubeProcessed}
                  onFlashcardsGenerated={handleFlashcardsGenerated}
                  onSummaryGenerated={handleSummaryGenerated}
                  onCardEdit={handleCardEdit}
                  onCardUpdate={handleCardUpdate}
                  onCloseEditor={() => setShowEditor(false)}
                  onCloseAnalytics={() => setShowAnalytics(false)}
                  onStyleChange={handleStyleChange}
                  onRecommendationsApply={handleRecommendationsApply}
                  onVisualCardsGenerated={handleVisualCardsGenerated}
                />
              </div>
            </div>
          ) : (
            <ActionCards onFeatureSelect={handleFeatureChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
