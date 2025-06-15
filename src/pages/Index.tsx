
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Upload, Bot, BarChart3, Users, Cloud, BookText, BookOpen } from 'lucide-react';

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
import WelcomeSection from '@/components/pages/index/WelcomeSection';
import FeaturesTabs from '@/components/pages/index/FeaturesTabs';
import QuickStats from '@/components/pages/index/QuickStats';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { isRTL } = useLanguage();
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

  const features = [
    {
      id: 'upload',
      title: 'رفع ومعالجة الصوت',
      icon: Upload,
      description: 'ارفع ملفاتك الصوتية أو سجل مباشرةً',
      component: <AudioUploader onFileUpload={handleFileUpload} onTranscriptGenerated={handleTranscriptGenerated} />
    },
    {
      id: 'summary',
      title: 'التحليل الذكي الشامل',
      icon: BookText,
      description: 'تحليل متكامل مع ملخص وبطاقات تعليمية وتوصيات ذكية',
      component: <AISummary transcript={transcript} onFlashcardsGenerated={handleFlashcardsGenerated} />
    },
    {
      id: 'generator',
      title: 'مولد البطاقات الذكي',
      icon: Bot,
      description: 'استخدم الذكاء الاصطناعي لإنشاء بطاقات تعليمية',
      component: <FlashcardGenerator 
        transcript={transcript} 
        onFlashcardsGenerated={handleFlashcardsGenerated}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    },
    {
      id: 'preview',
      title: 'معاينة البطاقات',
      icon: BookOpen,
      description: 'اعرض وراجع البطاقات المُنشأة',
      component: <FlashcardPreview flashcards={flashcards} onCardEdit={handleCardEdit} />
    },
    {
      id: 'editor',
      title: 'محرر البطاقات الذكي',
      icon: Bot,
      description: 'عدل وحسن البطاقات باستخدام الذكاء الاصطناعي',
      component: showEditor && selectedCard ? (
        <AICardEditor 
          card={selectedCard} 
          onCardUpdate={handleCardUpdate} 
          onClose={() => setShowEditor(false)} 
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>اختر بطاقة من المعاينة لتحريرها</p>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'تحليل الأداء',
      icon: BarChart3,
      description: 'تتبع تقدمك ونتائج التعلم',
      component: <AnalyticsDashboard isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />
    },
    {
      id: 'recommendations',
      title: 'التوصيات الذكية',
      icon: Bot,
      description: 'احصل على توصيات مخصصة لتحسين التعلم',
      component: <SmartRecommendationEngine transcript={transcript} onRecommendationsApply={handleRecommendationsApply} />
    },
    {
      id: 'personalization',
      title: 'التخصيص الشخصي',
      icon: Bot,
      description: 'خصص تجربة التعلم حسب احتياجاتك',
      component: <FlashcardPersonalization onStyleChange={handleStyleChange} />
    },
    {
      id: 'visual',
      title: 'البطاقات المرئية',
      icon: Bot,
      description: 'أنشئ بطاقات تحتوي على صور ومخططات',
      component: <VisualFlashcardGenerator transcript={transcript} onVisualCardsGenerated={handleVisualCardsGenerated} />
    },
    {
      id: 'community',
      title: 'مجتمع التعلم',
      icon: Users,
      description: 'شارك واستكشف البطاقات مع المجتمع',
      component: <CommunityModule />
    },
    {
      id: 'cloud',
      title: 'التكامل السحابي',
      icon: Cloud,
      description: 'احفظ وزامن بطاقاتك عبر التخزين السحابي',
      component: <CloudIntegration />
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <WelcomeSection isRTL={isRTL} />

      <Separator />

      <FeaturesTabs features={features} />

      <QuickStats isRTL={isRTL} />
    </div>
  );
};

export default Index;
