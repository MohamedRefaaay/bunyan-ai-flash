
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Upload, Youtube, Bot, BarChart3, Users, Cloud, Languages } from 'lucide-react';

import Header from '@/components/navigation/Header';
import AudioUploader from '@/components/AudioUploader';
import YouTubeIntegration from '@/components/YouTubeIntegration';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import FlashcardPreview from '@/components/FlashcardPreview';
import AICardEditor from '@/components/AICardEditor';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import SmartRecommendationEngine from '@/components/SmartRecommendationEngine';
import FlashcardPersonalization from '@/components/FlashcardPersonalization';
import VisualFlashcardGenerator from '@/components/VisualFlashcardGenerator';
import CommunityModule from '@/components/CommunityModule';
import CloudIntegration from '@/components/CloudIntegration';

const Index = () => {
  const [isRTL, setIsRTL] = useState(true);

  const features = [
    {
      id: 'upload',
      title: 'رفع الملفات الصوتية',
      icon: Upload,
      description: 'ارفع ملفاتك الصوتية للمحاضرات والدروس',
      component: <AudioUploader />
    },
    {
      id: 'youtube',
      title: 'استيراد من يوتيوب',
      icon: Youtube,
      description: 'استخرج المحتوى من مقاطع اليوتيوب التعليمية',
      component: <YouTubeIntegration />
    },
    {
      id: 'generator',
      title: 'مولد البطاقات الذكي',
      icon: Bot,
      description: 'استخدم الذكاء الاصطناعي لإنشاء بطاقات تعليمية',
      component: <FlashcardGenerator />
    },
    {
      id: 'preview',
      title: 'معاينة البطاقات',
      icon: BookOpen,
      description: 'اعرض وراجع البطاقات المُنشأة',
      component: <FlashcardPreview />
    },
    {
      id: 'editor',
      title: 'محرر البطاقات الذكي',
      icon: Bot,
      description: 'عدل وحسن البطاقات باستخدام الذكاء الاصطناعي',
      component: <AICardEditor />
    },
    {
      id: 'analytics',
      title: 'تحليل الأداء',
      icon: BarChart3,
      description: 'تتبع تقدمك ونتائج التعلم',
      component: <AnalyticsDashboard />
    },
    {
      id: 'recommendations',
      title: 'التوصيات الذكية',
      icon: Bot,
      description: 'احصل على توصيات مخصصة لتحسين التعلم',
      component: <SmartRecommendationEngine />
    },
    {
      id: 'personalization',
      title: 'التخصيص الشخصي',
      icon: Bot,
      description: 'خصص تجربة التعلم حسب احتياجاتك',
      component: <FlashcardPersonalization />
    },
    {
      id: 'visual',
      title: 'البطاقات المرئية',
      icon: Bot,
      description: 'أنشئ بطاقات تحتوي على صور ومخططات',
      component: <VisualFlashcardGenerator />
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
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRTL(!isRTL)}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {isRTL ? 'English' : 'العربية'}
          </Button>
        </div>

        {/* Welcome Section */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 text-blue-600" />
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {isRTL ? 'مرحباً بك في بنيان الذكي' : 'Welcome to Smart Bunyan'}
                </CardTitle>
                <p className="text-lg text-gray-600 mt-2">
                  {isRTL 
                    ? 'منصة البطاقات التعليمية المدعومة بالذكاء الاصطناعي' 
                    : 'AI-Powered Educational Flashcard Platform'
                  }
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 text-lg leading-relaxed">
              {isRTL 
                ? 'حول محاضراتك ودروسك إلى بطاقات تعليمية تفاعلية باستخدام أحدث تقنيات الذكاء الاصطناعي. تعلم بكفاءة أكبر واحتفظ بالمعلومات لفترة أطول.'
                : 'Transform your lectures and lessons into interactive educational flashcards using the latest AI technology. Learn more efficiently and retain information longer.'
              }
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Features Tabs */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-white/50 backdrop-blur-sm">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <feature.icon className="h-6 w-6" />
                <span className="text-xs text-center leading-tight">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  {feature.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">
              {isRTL ? 'بطاقة تم إنشاؤها' : 'Cards Generated'}
            </div>
          </Card>
          <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">
              {isRTL ? 'دقة الذكاء الاصطناعي' : 'AI Accuracy'}
            </div>
          </Card>
          <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600">
              {isRTL ? 'مستخدم نشط' : 'Active Users'}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
