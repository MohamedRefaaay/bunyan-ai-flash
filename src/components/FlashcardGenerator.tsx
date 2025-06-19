
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Bot, Settings, AlertCircle, Type, Download } from 'lucide-react';
import { toast } from 'sonner';
import { makeAIRequest, getAIProviderConfig } from '@/utils/aiProviders';
import { exportToAnki } from '@/utils/ankiExporter';
import FlashcardGeneratorButton from '@/components/flashcards/FlashcardGeneratorButton';
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
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  
  const generateFlashcards = async () => {
    if (!transcript) {
      toast.error('لا يوجد نص لإنشاء البطاقات منه');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح Gemini API في الإعدادات أولاً.", {
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

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "...", 
    "back": "...",
    "difficulty": "medium",
    "category": "عام",
    "tags": ["bunyan_ai"],
    "signature": "📘 Made with Bunyan_AI"
  }
]
`;

    const prompts = {
      qa: `قم بإنشاء 10 بطاقات تعليمية بصيغة سؤال وجواب من النص التالي باستخدام Gemini AI.
${basePromptInfo}`,

      cloze: `قم بإنشاء 10 بطاقات تعليمية بصيغة ملء الفراغات (Cloze) من النص التالي باستخدام Gemini AI. استخدم صيغة Anki القياسية {{c1::الكلمة}} في حقل "front".
${basePromptInfo}`,

      mcq: `قم بإنشاء 10 بطاقات تعليمية بصيغة اختيار من متعدد من النص التالي باستخدام Gemini AI. يجب أن يحتوي حقل "front" على السؤال، وحقل "back" على الخيارات مع توضيح الإجابة الصحيحة.
${basePromptInfo}`,
      
      true_false: `قم بإنشاء 10 بطاقات تعليمية بصيغة صح/خطأ من النص التالي باستخدام Gemini AI. يجب أن يحتوي حقل "front" على العبارة، وحقل "back" على "صح" أو "خطأ" مع شرح موجز.
${basePromptInfo}`
    };

    try {
      const response = await makeAIRequest(prompts[flashcardFormat], {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية باستخدام Gemini AI. أجب بصيغة JSON صحيحة فقط بدون أي نص إضافي.'
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      const parsedFlashcards = JSON.parse(cleanJson);
      
      if (Array.isArray(parsedFlashcards)) {
        setGeneratedFlashcards(parsedFlashcards);
        onFlashcardsGenerated(parsedFlashcards);
        toast.success(`تم إنشاء ${parsedFlashcards.length} بطاقة تعليمية بنجاح بواسطة Gemini!`);
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

  const handleExportToAnki = async () => {
    if (generatedFlashcards.length === 0) {
      toast.error('لا توجد بطاقات للتصدير');
      return;
    }

    try {
      await exportToAnki(generatedFlashcards, 'Bunyan AI Flashcards');
      toast.success(`تم تصدير ${generatedFlashcards.length} بطاقة إلى Anki بنجاح!`);
    } catch (error) {
      console.error('Error exporting to Anki:', error);
      toast.error('حدث خطأ في تصدير البطاقات');
    }
  };

  const config = getAIProviderConfig();

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-green-600" />
          مولد البطاقات التعليمية بـ Gemini AI
          {config && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Gemini Powered
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
                <h4 className="font-medium text-yellow-900">مطلوب إعداد Gemini AI</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  يرجى الذهاب إلى الإعدادات وإدخال مفتاح Gemini API
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

        {/* أزرار الإنشاء والتصدير */}
        <div className="space-y-3">
          <Button 
            onClick={generateFlashcards} 
            disabled={isProcessing || !transcript || !config}
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري إنشاء البطاقات بواسطة Gemini...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                إنشاء البطاقات بـ Gemini AI
              </>
            )}
          </Button>

          {generatedFlashcards.length > 0 && (
            <Button
              onClick={handleExportToAnki}
              variant="outline"
              className="w-full gap-2 border-green-300 text-green-700 hover:bg-green-50"
              size="lg"
            >
              <Download className="h-5 w-5" />
              تصدير إلى Anki ({generatedFlashcards.length} بطاقة)
            </Button>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="text-xs text-gray-500 space-y-1 bg-blue-50 p-3 rounded-lg">
          <p>• <strong>مدعوم بـ Google Gemini AI</strong> - أحدث تقنيات الذكاء الاصطناعي</p>
          <p>• يدعم اللغة العربية والإنجليزية بشكل متقدم</p>
          <p>• تصدير مباشر إلى Anki بصيغة CSV متوافقة</p>
          <p>• يمكن تحرير البطاقات بعد إنشائها</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardGenerator;
