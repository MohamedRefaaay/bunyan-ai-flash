
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActionCards from '@/components/dashboard/ActionCards';
import Sidebar from '@/components/dashboard/Sidebar';
import { Separator } from '@/components/ui/separator';
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
import type { Flashcard } from '@/types/flashcard';

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    setTranscript('');
    setFlashcards([]);
  };

  const handleTranscriptGenerated = (newTranscript: string) => {
    setTranscript(newTranscript);
  };

  const handleFlashcardsGenerated = (newFlashcards: Flashcard[]) => {
    setFlashcards(newFlashcards);
  };

  const handleCardEdit = (card: Flashcard) => {
    setSelectedCard(card);
    setShowEditor(true);
  };

  const handleCardUpdate = (updatedCard: Flashcard) => {
    setFlashcards(prev => 
      prev.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
    setShowEditor(false);
    setSelectedCard(null);
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

  const renderFeatureComponent = () => {
    switch (activeFeature) {
      case 'document-analyzer':
        return <DocumentAnalyzer />;
      case 'upload':
        return <AudioUploader onFileUpload={handleFileUpload} onTranscriptGenerated={handleTranscriptGenerated} />;
      case 'summary':
        return <AISummary transcript={transcript} onFlashcardsGenerated={handleFlashcardsGenerated} />;
      case 'generator':
        return <FlashcardGenerator 
          transcript={transcript} 
          onFlashcardsGenerated={handleFlashcardsGenerated}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />;
      case 'preview':
        return <FlashcardPreview flashcards={flashcards} onCardEdit={handleCardEdit} />;
      case 'editor':
        return showEditor && selectedCard ? (
          <AICardEditor 
            card={selectedCard} 
            onCardUpdate={handleCardUpdate} 
            onClose={() => setShowEditor(false)} 
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>اختر بطاقة من المعاينة لتحريرها</p>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />;
      case 'recommendations':
        return <SmartRecommendationEngine transcript={transcript} onRecommendationsApply={handleRecommendationsApply} />;
      case 'personalization':
        return <FlashcardPersonalization onStyleChange={handleStyleChange} />;
      case 'visual':
        return <VisualFlashcardGenerator transcript={transcript} onVisualCardsGenerated={handleVisualCardsGenerated} />;
      case 'community':
        return <CommunityModule />;
      case 'cloud':
        return <CloudIntegration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <Sidebar activeFeature={activeFeature} onFeatureChange={setActiveFeature} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <DashboardHeader />
            <DashboardStats flashcards={flashcards} />
            
            {/* Feature Content Area */}
            {activeFeature ? (
              <div className="mb-8">
                <Separator className="mb-6" />
                {renderFeatureComponent()}
              </div>
            ) : (
              <ActionCards onFeatureSelect={setActiveFeature} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
