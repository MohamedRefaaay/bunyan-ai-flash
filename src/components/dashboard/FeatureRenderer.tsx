
import React from 'react';
import AudioUploader from '@/components/AudioUploader';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashcardPreview from '@/components/FlashcardPreview';
import AICardEditor from '@/components/AICardEditor';
import AISummary from '@/components/AISummary';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import SmartRecommendationEngine from '@/components/SmartRecommendationEngine';
import FlashcardPersonalization from '@/components/FlashcardPersonalization';
import VisualFlashcardGenerator from '@/components/VisualFlashcardGenerator';
import CommunityModule from '@/components/CommunityModule';
import CloudIntegration from '@/components/CloudIntegration';
import DocumentAnalyzer from '@/components/document/DocumentAnalyzer';
import YouTubeSummarizer from '@/components/YouTubeSummarizer';
import type { Flashcard } from '@/types/flashcard';

interface FeatureRendererProps {
  activeFeature: string | null;
  transcript: string;
  flashcards: Flashcard[];
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  selectedCard: Flashcard | null;
  showEditor: boolean;
  showAnalytics: boolean;
  sessionId: string | null;
  onFileUpload: (file: File) => Promise<void>;
  onTranscriptGenerated: (transcript: string) => Promise<void>;
  onDocumentProcessed: (content: string, name: string) => Promise<void>;
  onYouTubeProcessed: (title: string, url: string, transcript: string, summary: string) => Promise<void>;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => Promise<void>;
  onSummaryGenerated: (summary: string, keyPoints: string[]) => void;
  onCardEdit: (card: Flashcard) => void;
  onCardUpdate: (card: Flashcard) => Promise<void>;
  onCloseEditor: () => void;
  onCloseAnalytics: () => void;
  onStyleChange: (styles: any) => void;
  onRecommendationsApply: (recommendations: any) => void;
  onVisualCardsGenerated: (cards: Flashcard[]) => void;
}

const FeatureRenderer = ({
  activeFeature,
  transcript,
  flashcards,
  isProcessing,
  setIsProcessing,
  selectedCard,
  showEditor,
  showAnalytics,
  sessionId,
  onFileUpload,
  onTranscriptGenerated,
  onDocumentProcessed,
  onYouTubeProcessed,
  onFlashcardsGenerated,
  onSummaryGenerated,
  onCardEdit,
  onCardUpdate,
  onCloseEditor,
  onCloseAnalytics,
  onStyleChange,
  onRecommendationsApply,
  onVisualCardsGenerated
}: FeatureRendererProps) => {
  // Add logging to track feature switching
  console.log('FeatureRenderer - Active feature:', activeFeature);

  switch (activeFeature) {
    case 'document-analyzer':
      return (
        <DocumentAnalyzer 
          onFlashcardsGenerated={onFlashcardsGenerated} 
          onDocumentProcessed={onDocumentProcessed} 
          sessionId={sessionId} 
        />
      );
    case 'youtube':
      return (
        <YouTubeSummarizer 
          onFlashcardsGenerated={onFlashcardsGenerated} 
          onYouTubeProcessed={onYouTubeProcessed} 
          sessionId={sessionId} 
        />
      );
    case 'upload':
      return (
        <AudioUploader 
          onFileUpload={onFileUpload} 
          onTranscriptGenerated={onTranscriptGenerated} 
        />
      );
    case 'summary':
      return (
        <AISummary 
          onSummaryGenerated={onSummaryGenerated} 
          onFlashcardsGenerated={onFlashcardsGenerated} 
          sessionId={sessionId} 
        />
      );
    case 'generator':
      return (
        <FlashcardGenerator 
          transcript={transcript} 
          onFlashcardsGenerated={onFlashcardsGenerated}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      );
    case 'preview':
      return <FlashcardPreview flashcards={flashcards} onCardEdit={onCardEdit} />;
    case 'editor':
      return showEditor && selectedCard ? (
        <AICardEditor 
          card={selectedCard} 
          onCardUpdate={onCardUpdate} 
          onClose={onCloseEditor} 
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>اختر بطاقة من المعاينة لتحريرها</p>
        </div>
      );
    case 'analytics':
      return <AnalyticsDashboard isVisible={showAnalytics} onClose={onCloseAnalytics} />;
    case 'recommendations':
      return <SmartRecommendationEngine transcript={transcript} onRecommendationsApply={onRecommendationsApply} />;
    case 'personalization':
      return <FlashcardPersonalization onStyleChange={onStyleChange} />;
    case 'visual':
      return <VisualFlashcardGenerator transcript={transcript} onVisualCardsGenerated={onVisualCardsGenerated} />;
    case 'community':
      return <CommunityModule />;
    case 'cloud':
      return <CloudIntegration />;
    default:
      return null;
  }
};

export default FeatureRenderer;
