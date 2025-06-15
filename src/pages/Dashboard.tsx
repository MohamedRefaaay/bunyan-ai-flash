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
import YouTubeSummarizer from '@/components/YouTubeSummarizer';
import type { Flashcard } from '@/types/flashcard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
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

  const handleFileUpload = async (file: File) => {
    console.log('File uploaded:', file.name);
    setTranscript('');
    setFlashcards([]);
    setSessionId(null);

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({ title: file.name, source_type: 'audio' })
        .select('id')
        .single();

      if (error) throw error;
      
      if (data?.id) {
        setSessionId(data.id);
        toast.success(`تم إنشاء جلسة للملف: ${file.name}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('فشل إنشاء جلسة للملف الصوتي.');
    }
  };

  const handleTranscriptGenerated = async (newTranscript: string) => {
    setTranscript(newTranscript);
    if (!sessionId) {
      // Don't show an error if no session, might be just text input
      return;
    }
    
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ transcript: newTranscript, status: 'transcribed' })
        .eq('id', sessionId);
      
      if (error) throw error;
      toast.success('تم حفظ النص بنجاح في الجلسة.');
    } catch (error) {
      console.error('Error updating session with transcript:', error);
      toast.error('فشل حفظ النص.');
    }
  };

  const handleDocumentProcessed = async (content: string, name: string) => {
    setTranscript(content);
    setFlashcards([]);
    setSessionId(null);

    try {
        const { data, error } = await supabase
            .from('sessions')
            .insert({ 
                title: name, 
                source_type: 'document',
                transcript: content,
                status: 'transcribed'
            })
            .select('id')
            .single();

        if (error) throw error;
        
        if (data?.id) {
            setSessionId(data.id);
            toast.success(`تم إنشاء جلسة للمستند: ${name}`);
        }
    } catch (error) {
        console.error('Error creating session for document:', error);
        toast.error('فشل إنشاء جلسة للمستند.');
    }
  };

  const handleYouTubeProcessed = async (title: string, url: string, transcript: string, summary: string) => {
    setTranscript(transcript);
    setFlashcards([]);
    setSessionId(null);

    try {
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                title: title,
                source_type: 'youtube',
                source_url: url,
                transcript: transcript,
                summary: summary,
                status: 'summarized'
            })
            .select('id')
            .single();

        if (error) throw error;
        
        if (data?.id) {
            setSessionId(data.id);
            toast.success(`تم إنشاء جلسة للفيديو: ${title}`);
        }
    } catch (error) {
        console.error('Error creating session for YouTube video:', error);
        toast.error('فشل إنشاء جلسة للفيديو.');
    }
  };

  const handleFlashcardsGenerated = async (newFlashcards: Flashcard[]) => {
    if (sessionId) {
      try {
        const flashcardsToInsert = newFlashcards.map(card => ({
            front: card.front,
            back: card.back,
            type: card.type || "basic",
            difficulty: card.difficulty,
            tags: card.tags || [],
            session_id: sessionId,
        }));

        const { data: insertedFlashcards, error: insertError } = await supabase
          .from('flashcards')
          .insert(flashcardsToInsert)
          .select();

        if (insertError) throw insertError;

        if (insertedFlashcards) {
            setFlashcards((prev) => [...prev, ...insertedFlashcards as Flashcard[]]);
            toast.success(`تم إنشاء وحفظ ${insertedFlashcards.length} بطاقة تعليمية!`);
        }
      } catch (error) {
        console.error('Error saving flashcards:', error);
        toast.error('حدث خطأ في حفظ البطاقات.');
      }
    } else {
      setFlashcards(newFlashcards);
      toast.warn("تم إنشاء البطاقات ولكن لم يتم العثور على جلسة لحفظها.");
    }
  };

  const handleCardEdit = (card: Flashcard) => {
    setSelectedCard(card);
    setShowEditor(true);
  };

  const handleCardUpdate = async (updatedCard: Flashcard) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
            front: updatedCard.front,
            back: updatedCard.back,
            difficulty: updatedCard.difficulty,
            type: updatedCard.type,
            tags: updatedCard.tags,
            updated_at: new Date().toISOString(),
        })
        .eq('id', updatedCard.id);

        if (error) throw error;

        setFlashcards(prev => 
            prev.map(card => card.id === updatedCard.id ? updatedCard : card)
        );
        setShowEditor(false);
        setSelectedCard(null);
        toast.success('تم تحديث البطاقة بنجاح!');
    } catch (error) {
        console.error('Error updating flashcard:', error);
        toast.error('فشل تحديث البطاقة.');
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

  const renderFeatureComponent = () => {
    switch (activeFeature) {
      case 'document-analyzer':
        return <DocumentAnalyzer onFlashcardsGenerated={handleFlashcardsGenerated} onDocumentProcessed={handleDocumentProcessed} sessionId={sessionId} />;
      case 'youtube':
        return <YouTubeSummarizer onFlashcardsGenerated={handleFlashcardsGenerated} onYouTubeProcessed={handleYouTubeProcessed} sessionId={sessionId} />;
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
            <Sidebar activeFeature={activeFeature} onFeatureChange={handleFeatureChange} />
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
              <ActionCards onFeatureSelect={handleFeatureChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
