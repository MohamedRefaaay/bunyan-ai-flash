
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Brain, Bot, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: 'محلل المستندات الذكي',
      description: 'تحليل وتلخيص المستندات باستخدام الذكاء الاصطناعي'
    },
    {
      icon: Bot,
      title: 'مولد البطاقات التعليمية',
      description: 'تحويل المحاضرات إلى بطاقات تعليمية تفاعلية'
    },
    {
      icon: BarChart3,
      title: 'تحليل الأداء المتقدم',
      description: 'تتبع التقدم وتحسين عملية التعلم'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center mb-4 lg:mb-6">
            <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            مرحباً بك في بنيان الذكي
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            منصة متقدمة لتحويل المحاضرات والمستندات إلى بطاقات تعليمية ذكية باستخدام أحدث تقنيات الذكاء الاصطناعي
          </p>
          <Button 
            size="lg" 
            className="gap-2 text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 h-auto"
            onClick={() => navigate('/dashboard')}
          >
            ابدأ الآن
            <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 lg:p-4 bg-blue-100 rounded-full">
                    <feature.icon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-lg lg:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white max-w-2xl mx-auto">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
                جاهز لتحويل طريقة تعلمك؟
              </h2>
              <p className="mb-4 lg:mb-6 opacity-90 text-sm lg:text-base leading-relaxed">
                انضم إلى آلاف الطلاب الذين يستخدمون بنيان الذكي لتحسين تجربة التعلم
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-base px-6 py-3 h-auto"
                onClick={() => navigate('/dashboard')}
              >
                ادخل إلى لوحة التحكم
                <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
