
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface WelcomeSectionProps {
  isRTL: boolean;
}

const WelcomeSection = ({ isRTL }: WelcomeSectionProps) => {
  return (
    <Card>
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
  );
};

export default WelcomeSection;
