
import React from 'react';
import { Card } from '@/components/ui/card';

interface QuickStatsProps {
  isRTL: boolean;
}

const QuickStats = ({ isRTL }: QuickStatsProps) => {
  return (
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
  );
};

export default QuickStats;
