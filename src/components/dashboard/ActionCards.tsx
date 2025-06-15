
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Upload, Brain, Bot, BarChart3, BookOpen, Lightbulb } from 'lucide-react';

interface ActionCardsProps {
  onFeatureSelect?: (feature: string) => void;
}

const ActionCards = ({ onFeatureSelect }: ActionCardsProps) => {
  const cards = [
    {
      id: 'document-analyzer',
      title: 'محلل المستندات الذكي',
      description: 'تحليل وتلخيص المستندات باستخدام الذكاء الاصطناعي',
      icon: Brain,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'upload',
      title: 'رفع الملفات الصوتية',
      description: 'تحويل الصوت إلى نص ثم إلى بطاقات تعليمية',
      icon: Upload,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'generator',
      title: 'مولد البطاقات الذكي',
      description: 'إنشاء بطاقات تعليمية تفاعلية',
      icon: Bot,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'preview',
      title: 'معاينة البطاقات',
      description: 'عرض ومراجعة البطاقات المنشأة',
      icon: BookOpen,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      id: 'analytics',
      title: 'تحليل الأداء',
      description: 'تتبع التقدم ونتائج التعلم',
      icon: BarChart3,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      id: 'community',
      title: 'مجتمع التعلم',
      description: 'شارك واستكشف البطاقات مع المجتمع',
      icon: Users,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const handleCardClick = (cardId: string) => {
    if (onFeatureSelect) {
      onFeatureSelect(cardId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`${card.bgColor} border-0 hover:shadow-md transition-shadow cursor-pointer`}
          onClick={() => handleCardClick(card.id)}
        >
          <CardContent className="p-6 text-center">
            <div className={`inline-flex p-4 rounded-xl ${card.iconColor} bg-white mb-4`}>
              <card.icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActionCards;
