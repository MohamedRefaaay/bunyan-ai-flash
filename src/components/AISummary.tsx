
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, AlertCircle, Settings, Type } from 'lucide-react';
import { toast } from 'sonner';
import { makeAIRequest, getAIProviderConfig } from '@/utils/aiProviders';
import type { Flashcard } from '@/types/flashcard';

interface AISummaryProps {
  onSummaryGenerated: (summary: string, keyPoints: string[]) => void;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  sessionId: string | null;
}

const AISummary = ({ onSummaryGenerated, onFlashcardsGenerated, sessionId }: AISummaryProps) => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [flashcardFormat, setFlashcardFormat] = useState<'qa' | 'cloze' | 'mcq' | 'true_false'>('qa');

  const generateSummary = async () => {
    if (!content.trim()) {
      toast.error('يرجى إدخال النص المراد تحليله');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح Gemini في الإعدادات أولاً.", {
        action: {
          label: "إعدادات",
          onClick: () => window.location.href = "/settings"
        }
      });
      return;
    }

    setIsProcessing(true);
    setSummary('');
    setKeyPoints([]);

    try {
      const prompt = `قم بتحليل وتلخيص النص التالي باستخدام Google Gemini:

${content}

أريد منك:
1. ملخص شامل للنص (3-4 فقرات)
2. استخراج النقاط الرئيسية (5-8 نقاط)
3. تقديم التحليل بشكل واضح ومفيد

يجب أن تكون الإجابة بصيغة JSON مع هذا التنسيق:
{
  "summary": "الملخص الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...]
}`;

      const result = await makeAIRequest(prompt, {
        systemPrompt: 'أنت خبير في تحليل وتلخيص النصوص باستخدام Google Gemini. أجب بصيغة JSON صحيحة فقط.'
      });

      let analysis;
      try {
        const cleanJson = result.replace(/```json|```/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini:", result);
        toast.error("فشل تحليل استجابة Gemini. قد تكون الاستجابة غير متوقعة.");
        throw new Error("Invalid JSON response from Gemini.");
      }

      setSummary(analysis.summary);
      setKeyPoints(analysis.keyPoints || []);
      onSummaryGenerated(analysis.summary, analysis.keyPoints || []);

    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في تحليل النص');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcards = async () => {
    if (!summary) {
      toast.error('يرجى تحليل النص أولاً لإنشاء البطاقات');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح Gemini في الإعدادات أولاً.");
      return;
    }

    setIsProcessing(true);

    try {
      const basePromptInfo = `
بناءً على تحليل هذا النص باستخدام Google Gemini:
الملخص: ${summary}
النقاط الرئيسية:
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق (لا تقم بإضافة التوقيع، سأضيفه بنفسي):
[
  {
    "id": "1",
    "front": "...", 
    "back": "...",
    "difficulty": "medium",
    "category": "تحليل ذكي",
    "tags": ["bunyan_ai", "gemini"],
    "source": "AI Summary"
  }
]`;

      const prompts = {
        qa: `قم بإنشاء 10 بطاقات تعليمية بصيغة سؤال وجواب. ${basePromptInfo}`,
        cloze: `قم بإنشاء 10 بطاقات تعليمية بصيغة ملء الفراغات (Cloze). استخدم صيغة Anki القياسية {{c1::الكلمة}} في حقل "front". ${basePromptInfo}`,
        mcq: `قم بإنشاء 10 بطاقات تعليمية بصيغة اختيار من متعدد. يجب أن يحتوي حقل "front" على السؤال، وحقل "back" على الخيارات مع توضيح الإجابة الصحيحة. ${basePromptInfo}`,
        true_false: `قم بإنشاء 10 بطاقات تعليمية بصيغة صح/خطأ. يجب أن يحتوي حقل "front" على العبارة، وحقل "back" على "صح" أو "خطأ" مع شرح موجز. ${basePromptInfo}`
      };

      const flashcardsResult = await makeAIRequest(prompts[flashcardFormat], {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية من النصوص باستخدام Google Gemini. أجب بصيغة JSON صحيحة فقط.'
      });

      let flashcards: any[];
      try {
        const cleanJson = flashcardsResult.replace(/```json|```/g, '').trim();
        flashcards = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini:", flashcardsResult);
        toast.error("فشل تحليل استجابة Gemini للبطاقات.");
        throw new Error("Invalid JSON response for flashcards from Gemini.");
      }

      if (Array.isArray(flashcards)) {
        const flashcardsWithSignature = flashcards.map(card => ({
          ...card,
          tags: card.tags || ['bunyan_ai', 'gemini'],
          back: card.back ? `${card.back}\n\n📘 Made with Bunyan_Anki_AI & Google Gemini` : '📘 Made with Bunyan_Anki_AI & Google Gemini'
        }));
        onFlashcardsGenerated(flashcardsWithSignature as Flashcard[]);
        toast.success(`تم إنشاء ${flashcardsWithSignature.length} بطاقة تعليمية بنجاح باستخدام Google Gemini!`);
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
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          التحليل الذكي للنصوص
          {config && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              مدعوم بـ Google Gemini
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!config && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900">مطلوب إعداد Google Gemini</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  يرجى الذهاب إلى الإعدادات وإدخال مفتاح Gemini API المجاني
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings"}>
                <Settings className="h-4 w-4 mr-2" />
                إعدادات
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              النص المراد تحليله:
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="أدخل النص الذي تريد تحليله وتلخيصه..."
              className="min-h-32"
              disabled={isProcessing}
            />
          </div>

          <Button
            onClick={generateSummary}
            disabled={isProcessing || !content.trim() || !config}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                تحليل النص
              </>
            )}
          </Button>
        </div>

        {(summary || keyPoints.length > 0) && (
          <div className="space-y-4 border-t pt-4">
            {summary && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-3">الملخص:</h3>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {keyPoints.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-3">النقاط الرئيسية:</h3>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

            <Button
              onClick={generateFlashcards}
              disabled={isProcessing || !config || !sessionId}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري إنشاء البطاقات...
                </>
              ) : (
                <>
                  🎯 مولد البطاقات
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• قم بلصق أي نص تعليمي أو مقال</p>
          <p>• سيتم تحليله وتلخيصه باستخدام Google Gemini</p>
          <p>• إنشاء بطاقات تعليمية تفاعلية من المحتوى</p>
          <p>• احصل على مفتاح Gemini مجاناً من Google AI Studio</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISummary;
