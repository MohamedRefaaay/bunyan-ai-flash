import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Youtube, Play, FileText, BookOpen, Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { makeAIRequest, getAIProviderConfig } from '@/utils/aiProviders';
import type { Flashcard } from '@/types/flashcard';
import { supabase } from '@/integrations/supabase/client';

interface YouTubeSummarizerProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  onYouTubeProcessed: (title: string, url: string, transcript: string, summary: string) => Promise<void>;
  sessionId: string | null;
}

const YouTubeSummarizer = ({ onFlashcardsGenerated, onYouTubeProcessed, sessionId }: YouTubeSummarizerProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [videoInfo, setVideoInfo] = useState<{title: string, duration: string} | null>(null);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generateVideoSummary = async () => {
    if (!videoUrl) {
      toast.error('يرجى إدخال رابط فيديو يوتيوب');
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

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error('رابط يوتيوب غير صحيح');
      return;
    }

    setIsProcessing(true);
    setSummary('');
    setKeyPoints([]);
    setVideoInfo(null);

    try {
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('youtube-transcript', {
        body: { videoId },
      });

      if (transcriptError) {
        throw new Error(transcriptError.message);
      }
      if (transcriptData.error) {
        throw new Error(transcriptData.error);
      }

      const { transcript, title } = transcriptData;

      const fetchedVideoInfo = {
        title: title,
        duration: 'غير متاح'
      };
      setVideoInfo(fetchedVideoInfo);
      
      const summaryPrompt = `قم بتحليل وتلخيص محتوى هذا الفيديو التعليمي من يوتيوب:

العنوان: ${fetchedVideoInfo.title}

محتوى الفيديو:
${transcript}

أريد منك:
1. ملخص شامل للفيديو (3-4 فقرات)
2. استخراج النقاط الرئيسية (5-8 نقاط)
3. تقديم التحليل بشكل واضح ومفيد

يجب أن تكون الإجابة بصيغة JSON مع هذا التنسيق:
{
  "summary": "الملخص الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...]
}`;

      const analysisResult = await makeAIRequest(summaryPrompt, {
        systemPrompt: 'أنت خبير في تحليل وتلخيص المحتوى التعليمي. أجب بصيغة JSON صحيحة فقط.'
      });

      let analysis;
      try {
        const cleanJson = analysisResult.replace(/```json|```/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch(e) {
        console.error("Failed to parse JSON from summary AI:", analysisResult);
        toast.error("فشل تحليل استجابة الذكاء الاصطناعي. قد تكون الاستجابة غير متوقعة.");
        throw new Error("Invalid JSON response for summary.");
      }
      
      setSummary(analysis.summary);
      setKeyPoints(analysis.keyPoints || []);
      
      await onYouTubeProcessed(
        fetchedVideoInfo.title,
        videoUrl,
        transcript,
        analysis.summary
      );
      
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في تحليل الفيديو');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcardsFromVideo = async () => {
    if (!summary) {
      toast.error('يرجى تحليل الفيديو أولاً لإنشاء البطاقات');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح API في الإعدادات أولاً.");
      return;
    }

    setIsProcessing(true);

    try {
      const flashcardPrompt = `بناءً على تحليل هذا الفيديو التعليمي، قم بإنشاء 12 بطاقة تعليمية:

الملخص: ${summary}

النقاط الرئيسية:
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "السؤال هنا", 
    "back": "الإجابة هنا",
    "difficulty": "medium",
    "category": "فيديو يوتيوب",
    "tags": ["يوتيوب", "تعليمي"],
    "source": "YouTube Video"
  }
]

تأكد من تنويع أنواع الأسئلة وتغطية المحتوى بشكل شامل.`;

      const flashcardsResult = await makeAIRequest(flashcardPrompt, {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية من المحتوى المرئي. أجب بصيغة JSON صحيحة فقط.'
      });

      let flashcards: any[];
      try {
        const cleanJson = flashcardsResult.replace(/```json|```/g, '').trim();
        flashcards = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse JSON from flashcards AI:", flashcardsResult);
        toast.error("فشل تحليل استجابة الذكاء الاصطناعي للبطاقات.");
        throw new Error("Invalid JSON response for flashcards.");
      }
      
      if (Array.isArray(flashcards)) {
        onFlashcardsGenerated(flashcards as Flashcard[]);
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
    <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-6 w-6 text-red-600" />
          تلخيص وتحليل فيديوهات يوتيوب
          {config && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              مدعوم بـ {config.provider.toUpperCase()}
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

        {/* إدخال رابط الفيديو */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            رابط فيديو يوتيوب:
          </label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
              disabled={isProcessing}
            />
            <Button 
              onClick={generateVideoSummary}
              disabled={isProcessing || !videoUrl || !config}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  تحليل الفيديو
                </>
              )}
            </Button>
          </div>
        </div>

        {/* معلومات الفيديو */}
        {videoInfo && (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-2">معلومات الفيديو:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>العنوان:</strong> {videoInfo.title}</p>
            </div>
          </div>
        )}

        {/* النتائج */}
        {(summary || keyPoints.length > 0) && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                الملخص
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                النقاط الرئيسية
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-3">ملخص الفيديو:</h3>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            </TabsContent>

            <TabsContent value="points" className="mt-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-3">النقاط الرئيسية:</h3>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-red-600 font-medium">{index + 1}.</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* إنشاء البطاقات */}
        {summary && (
          <Button 
            onClick={generateFlashcardsFromVideo}
            disabled={isProcessing || !config || !sessionId}
            className="w-full gap-2 bg-red-600 hover:bg-red-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري إنشاء البطاقات...
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5" />
                إنشاء بطاقات تعليمية من الفيديو
              </>
            )}
          </Button>
        )}

        {/* معلومات إضافية */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• يدعم روابط يوتيوب بجميع الصيغ</p>
          <p>• يحلل المحتوى ويستخرج النقاط المهمة</p>
          <p>• ينشئ بطاقات تعليمية تفاعلية</p>
          <p>• ملاحظة: هذه الميزة تتطلب أن يكون لدى الفيديو نص (caption) متاح.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeSummarizer;
