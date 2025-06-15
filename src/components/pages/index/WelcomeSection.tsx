
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Smartphone, Tablet, Monitor } from 'lucide-react';

interface WelcomeSectionProps {
  isRTL: boolean;
}

const WelcomeSection = ({ isRTL }: WelcomeSectionProps) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-12 w-12 text-blue-600" />
          <div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {isRTL ? 'بنيان الذكي' : 'Smart Bunyan'}
            </CardTitle>
            <p className="text-lg md:text-xl text-blue-700 font-medium">
              {isRTL
                ? 'تعلم بلا حدود. تجربتك التعليمية، مصممة لكل شاشة.'
                : 'Learn Without Limits. Your Educational Experience, Designed for Every Screen.'
              }
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {isRTL
              ? 'منصة البطاقات التعليمية المدعومة بالذكاء الاصطناعي - واجهة متجاوبة بالكامل تتكيف مع جميع أحجام الشاشات والأجهزة تلقائيًا'
              : 'AI-Powered Educational Flashcard Platform - Fully responsive interface that adapts to all screen sizes and devices automatically'
            }
          </p>
        </div>

        {/* Device Icons */}
        <div className="flex justify-center items-center gap-8 py-4">
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <Smartphone className="h-8 w-8" />
            <span className="text-xs font-medium">
              {isRTL ? 'هاتف' : 'Phone'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <Tablet className="h-8 w-8" />
            <span className="text-xs font-medium">
              {isRTL ? 'جهاز لوحي' : 'Tablet'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <Monitor className="h-8 w-8" />
            <span className="text-xs font-medium">
              {isRTL ? 'حاسوب' : 'Desktop'}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {isRTL ? '✨ تجربة متكاملة عبر جميع الأجهزة' : '✨ Seamless Experience Across All Devices'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {isRTL ? 'تنقل بإيماءات لمس بديهية على الهاتف' : 'Intuitive touch gestures on mobile'}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {isRTL ? 'تفاعل بالفأرة ولوحة المفاتيح على الحاسوب' : 'Mouse and keyboard interaction on desktop'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {isRTL ? 'وضع نهاري وليلي مريح للعينين' : 'Day and night modes for eye comfort'}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {isRTL ? 'رسوم متحركة انسيابية وأداء فائق' : 'Smooth animations and superior performance'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl font-bold text-blue-800">
            {isRTL
              ? 'تعلمك، على طريقتك، في أي وقت ومن أي مكان.'
              : 'Your Learning, Your Way, Anytime, Anywhere.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
