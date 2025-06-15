
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Bot, Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { makeAIRequest, getAIProviderConfig } from '@/utils/aiProviders';
import type { Flashcard } from '@/types/flashcard';

interface FlashcardGeneratorProps {
  transcript: string;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const FlashcardGenerator = ({ 
  transcript, 
  onFlashcardsGenerated, 
  isProcessing, 
  setIsProcessing 
}: FlashcardGeneratorProps) => {
  const [generationType, setGenerationType] = useState<'basic' | 'advanced' | 'comprehensive'>('advanced');
  
  const generateFlashcards = async () => {
    if (!transcript) {
      toast.error('لا يوجد نص لإنشاء البطاقات منه');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح API في الإعدادات أولاً.", {
        action: {
          label: "إعدادات",
          onClick: () => window.location.href = "/settings"
        }
      });
      return;
    }

    setIsProcessing(true);

    const prompts = {
      basic: `قم بتحليل هذا النص وإنشاء 10 بطاقات تعليمية أساسية:

النص: ${transcript}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "السؤال هنا",
    "back": "الإجابة هنا",
    "difficulty": "easy",
    "category": "عام",
    "tags": ["tag1", "tag2"]
  }
]`,

      advanced: `قم بتحليل هذا النص وإنشاء 15 بطاقة تعليمية متقدمة مع مستويات صعوبة مختلفة:

النص: ${transcript}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1", 
    "front": "السؤال هنا",
    "back": "الإجابة التفصيلية هنا",
    "difficulty": "medium",
    "category": "تصنيف المحتوى",
    "tags": ["tag1", "tag2", "tag3"],
    "explanation": "شرح إضافي للإجابة"
  }
]

تأكد من تنويع مستويات الصعوبة: easy, medium, hard`,

      comprehensive: `قم بتحليل هذا النص وإنشاء 25 بطاقة تعليمية شاملة ومتنوعة:

النص: ${transcript}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "السؤال هنا", 
    "back": "الإجابة الشاملة هنا",
    "difficulty": "medium",
    "category": "تصنيف دقيق",
    "tags": ["tag1", "tag2", "tag3"],
    "explanation": "شرح مفصل",
    "examples": ["مثال 1", "مثال 2"],
    "relatedConcepts": ["مفهوم متصل 1", "مفهوم متصل 2"]
  }
]

تأكد من:
- تنويع أنواع الأسئلة (تعريف، تطبيق، تحليل، تقييم)
- تغطية جميع النقاط المهمة في النص
- إضافة أمثلة عملية حيثما أمكن`
    };

    try {
      const response = await makeAIRequest(prompts[generationType], {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية. أجب بصيغة JSON صحيحة فقط بدون أي نص إضافي.'
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const flashcards = JSON.parse(cleanJson);
      
      if (Array.isArray(flashcards)) {
        onFlashcardsGenerated(flashcards);
        toast.success(`تم إنشاء ${flashcards.length} بطاقة تعليمية بنجاح!`);
      } else {
        throw new Error('تنسيق غير صحيح للبطاقات');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في إنشاء البطاقات');
    } finally {
      setIsProcessing(false);
    }
  };

  const config = getAIProviderConfig();

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-green-600" />
          مولد البطاقات التعليمية الذكي
          {config && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {config.provider.toUpperCase()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!config && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900">مطلوب إعداد مزود الذكاء الاصطناعي</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  يرجى الذهاب إلى الإعدادات وإدخال مفتاح API لأحد مزودي الذكاء الاصطناعي
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings"}>
                <Settings className="h-4 w-4 mr-2" />
                إعدادات
              </Button>
            </div>
          </div>
        )}

        {/* نوع الإنشاء */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">اختر نوع الإنشاء:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'basic', label: 'أساسي', desc: '10 بطاقات سريعة', color: 'bg-blue-50 border-blue-200' },
              { value: 'advanced', label: 'متقدم', desc: '15 بطاقة متنوعة', color: 'bg-green-50 border-green-200' },
              { value: 'comprehensive', label: 'شامل', desc: '25 بطاقة مفصلة', color: 'bg-purple-50 border-purple-200' }
            ].map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all ${
                  generationType === type.value 
                    ? `${type.color} border-2` 
                    : 'bg-white border hover:shadow-md'
                }`}
                onClick={() => setGenerationType(type.value as any)}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* معلومات النص */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">معاينة النص:</h4>
            <p className="text-sm text-gray-700 line-clamp-3">
              {transcript.substring(0, 200)}...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              طول النص: {transcript.length} حرف
            </p>
          </div>
        )}

        {/* زر الإنشاء */}
        <Button 
          onClick={generateFlashcards} 
          disabled={isProcessing || !transcript || !config}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري إنشاء البطاقات التعليمية...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              إنشاء البطاقات التعليمية الذكية
            </>
          )}
        </Button>

        {/* معلومات إضافية */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• يتم إنشاء البطاقات باستخدام الذكاء الاصطناعي المتقدم</p>
          <p>• يدعم اللغة العربية والإنجليزية</p>
          <p>• يمكن تحرير البطاقات بعد إنشائها</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardGenerator;
