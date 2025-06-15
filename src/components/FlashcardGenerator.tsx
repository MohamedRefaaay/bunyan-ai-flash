import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Bot, Settings, AlertCircle, Type } from 'lucide-react';
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
  const [flashcardFormat, setFlashcardFormat] = useState<'qa' | 'cloze' | 'mcq' | 'true_false'>('qa');
  
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

    const basePromptInfo = `
النص: ${transcript}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق (لا تقم بإضافة التوقيع، سأضيفه بنفسي):
[
  {
    "id": "1",
    "front": "...", 
    "back": "...",
    "difficulty": "medium",
    "category": "عام",
    "tags": ["bunyan_ai"]
  }
]
`;

    const prompts = {
      qa: `قم بإنشاء 10 بطاقات تعليمية بصيغة سؤال وجواب من النص التالي.
${basePromptInfo}`,

      cloze: `قم بإنشاء 10 بطاقات تعليمية بصيغة ملء الفراغات (Cloze) من النص التالي. استخدم صيغة Anki القياسية {{c1::الكلمة}} في حقل "front".
${basePromptInfo}`,

      mcq: `قم بإنشاء 10 بطاقات تعليمية بصيغة اختيار من متعدد من النص التالي. يجب أن يحتوي حقل "front" على السؤال، وحقل "back" على الخيارات مع توضيح الإجابة الصحيحة.
${basePromptInfo}`,
      
      true_false: `قم بإنشاء 10 بطاقات تعليمية بصيغة صح/خطأ من النص التالي. يجب أن يحتوي حقل "front" على العبارة، وحقل "back" على "صح" أو "خطأ" مع شرح موجز.
${basePromptInfo}`
    };

    try {
      const response = await makeAIRequest(prompts[flashcardFormat], {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية. أجب بصيغة JSON صحيحة فقط بدون أي نص إضافي.'
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const parsedFlashcards = JSON.parse(cleanJson);
      
      if (Array.isArray(parsedFlashcards)) {
        const flashcardsWithSignature = parsedFlashcards.map(card => ({
            ...card,
            back: card.back ? `${card.back}\n\n📘 Made with Bunyan_Anki_AI` : '📘 Made with Bunyan_Anki_AI'
        }));

        onFlashcardsGenerated(flashcardsWithSignature);
        toast.success(`تم إنشاء ${flashcardsWithSignature.length} بطاقة تعليمية بنجاح!`);
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
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Type className="h-5 w-5 text-gray-700" />
            اختر شكل البطاقة:
          </h3>
          <Select onValueChange={(value) => setFlashcardFormat(value as any)} defaultValue="qa">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر نوع البطاقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qa">سؤال و جواب</SelectItem>
              <SelectItem value="cloze">ملء الفراغات (Cloze)</SelectItem>
              <SelectItem value="mcq">اختيار من متعدد</SelectItem>
              <SelectItem value="true_false">صح / خطأ</SelectItem>
            </SelectContent>
          </Select>
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
