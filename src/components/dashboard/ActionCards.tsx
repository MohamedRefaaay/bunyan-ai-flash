
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Upload } from 'lucide-react';

const ActionCards = () => {
  const cards = [
    {
      title: 'عرض السجل',
      description: 'ستظهر محاضراتك الفعالية هنا',
      icon: Clock,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'مراجعة البطاقات',
      description: 'دراسة البطاقات المنشأة',
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'رفع محاضرة جديدة',
      description: 'تحويل الصوت إلى بطاقات تعليمية',
      icon: Upload,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-0 hover:shadow-md transition-shadow cursor-pointer`}>
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
