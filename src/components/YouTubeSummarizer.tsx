
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Youtube, 
  Download, 
  Bot, 
  Sparkles, 
  BookText,
  FileText,
  Target,
  BookOpen,
  Lightbulb,
  Play,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import type { Flashcard } from "@/types/flashcard";

interface YouTubeSummarizerProps {
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void;
}

const YouTubeSummarizer = ({ onFlashcardsGenerated }: YouTubeSummarizerProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState("");
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const processYouTubeVideo = async () => {
    if (!videoUrl) {
      toast.error("يرجى إدخال رابط فيديو يوتيوب صالح");
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error("رابط يوتيوب غير صالح");
      return;
    }

    const geminiApiKey = localStorage.getItem("gemini_api_key");
    if (!geminiApiKey) {
      toast.error("الرجاء إدخال مفتاح Gemini API في صفحة الإعدادات أولاً");
      return;
    }

    setIsProcessing(true);
    setTranscript("");
    setSummary("");
    setKeyPoints([]);
    setRecommendations([]);
    setStudyPlan("");
    setVideoInfo(null);

    try {
      // محاولة الحصول على النص من الفيديو باستخدام Gemini
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      
      const prompt = `
أنت خبير في تحليل محتوى الفيديوهات التعليمية. يرجى زيارة فيديو يوتيوب التالي وتقديم تحليل شامل:

رابط الفيديو: https://www.youtube.com/watch?v=${videoId}

المطلوب:
1. استخراج المحتوى الرئيسي والنقاط المهمة من الفيديو
2. إنشاء ملخص شامل ومفيد (3-4 فقرات)
3. تحديد النقاط الرئيسية والمفاهيم المهمة (5-8 نقاط)
4. تقديم توصيات دراسية مخصصة (4-6 توصيات)
5. اقتراح خطة دراسية لإتقان هذا المحتوى
6. معلومات أساسية عن الفيديو (العنوان، الوصف المختصر)

تنسيق الإجابة بـ JSON:
{
  "videoInfo": {
    "title": "عنوان الفيديو",
    "description": "وصف مختصر للفيديو"
  },
  "content": "المحتوى المستخرج من الفيديو",
  "summary": "الملخص الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...],
  "recommendations": ["التوصية الأولى", "التوصية الثانية", ...],
  "studyPlan": "خطة الدراسة المفصلة هنا"
}

تأكد من أن جميع المحتويات باللغة العربية ومفيدة تعليمياً.
`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        })
      });

      if (!response.ok) {
        throw new Error("فشل في معالجة الفيديو");
      }

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const analysisText = result.candidates[0].content.parts[0].text;
        
        try {
          const cleanJson = analysisText.replace(/```json|```/g, '').trim();
          const analysisData = JSON.parse(cleanJson);
          
          setVideoInfo(analysisData.videoInfo);
          setTranscript(analysisData.content || analysisText);
          setSummary(analysisData.summary);
          setKeyPoints(analysisData.keyPoints || []);
          setRecommendations(analysisData.recommendations || []);
          setStudyPlan(analysisData.studyPlan);
        } catch {
          setTranscript(analysisText);
          setSummary(analysisText);
        }
        
        toast.success("تم تحليل فيديو يوتيوب بنجاح!");
      } else {
        throw new Error("لم يتمكن من تحليل الفيديو");
      }
    } catch (error) {
      console.error("خطأ في معالجة الفيديو:", error);
      toast.error("حدث خطأ أثناء معالجة الفيديو. تأكد من صحة الرابط وحاول مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcards = async () => {
    if (!transcript) {
      toast.error("يرجى معالجة فيديو يوتيوب أولاً");
      return;
    }

    const openAIApiKey = localStorage.getItem("openai_api_key");
    if (!openAIApiKey) {
      toast.error("الرجاء إدخال مفتاح OpenAI API في صفحة الإعدادات أولاً");
      return;
    }

    setIsGeneratingCards(true);
    
    try {
      const systemPrompt = `You are an expert in creating educational flashcards from YouTube video content.
Generate 10 flashcards based on the provided video transcript.
The difficulty level should be 'medium'.
The language of the flashcards should be Arabic.

Please provide the output as a single JSON object with a key "flashcards" which contains an array of flashcard objects.
Each flashcard object must have 'front' and 'back' string properties.
Example format: {"flashcards": [{"front": "Question 1", "back": "Answer 1"}]}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Video content:\n---\n${transcript}\n---\nPlease generate the flashcards now.` }
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إنشاء البطاقات");
      }

      const result = await response.json();
      const content = JSON.parse(result.choices[0].message.content);
      const generatedCards = content.flashcards;

      const newFlashcards: Flashcard[] = generatedCards.map((card: any, i: number) => ({
        id: `youtube-card-${Date.now()}-${i}`,
        front: card.front || "",
        back: card.back || "",
        type: "basic" as const,
        difficulty: "medium" as const
      }));

      setFlashcards(newFlashcards);
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(newFlashcards);
      }
      toast.success(`تم إنشاء ${newFlashcards.length} بطاقة تعليمية من الفيديو!`);
    } catch (error) {
      console.error("خطأ في إنشاء البطاقات:", error);
      toast.error("حدث خطأ أثناء إنشاء البطاقات");
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary && !transcript) {
      toast.error("لا يوجد محتوى لتنزيله");
      return;
    }
    
    const fullContent = `
تلخيص فيديو يوتيوب
=====================================

${videoInfo ? `
معلومات الفيديو:
العنوان: ${videoInfo.title}
الوصف: ${videoInfo.description}
الرابط: ${videoUrl}

` : ''}

المحتوى المستخرج:
${transcript}

${summary ? `
الملخص:
${summary}
` : ''}

${keyPoints.length > 0 ? `
النقاط الرئيسية:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}
` : ''}

${recommendations.length > 0 ? `
التوصيات الدراسية:
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
` : ''}

${studyPlan ? `
خطة الدراسة المقترحة:
${studyPlan}
` : ''}

${flashcards.length > 0 ? `
البطاقات التعليمية المُنشأة:
${flashcards.map((card, i) => `
البطاقة ${i + 1}:
السؤال: ${card.front}
الإجابة: ${card.back}
`).join('\n')}
` : ''}
    `;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(fullContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "youtube_summary.txt");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل ملخص الفيديو!");
  };

  return (
    <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <span className="text-xl">تلخيص فيديوهات يوتيوب</span>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Sparkles className="h-3 w-3 mr-1" />
              مدعوم بالذكاء الاصطناعي
            </Badge>
          </div>
          {(summary || transcript) && !isProcessing && (
            <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
              <Download className="h-4 w-4" />
              تنزيل التلخيص
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="أدخل رابط فيديو يوتيوب هنا..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={processYouTubeVideo} 
              disabled={isProcessing || !videoUrl} 
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4" />
                  تحليل الفيديو
                </>
              )}
            </Button>
          </div>

          {videoInfo && (
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{videoInfo.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{videoInfo.description}</p>
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      مشاهدة الفيديو
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {(summary || keyPoints.length > 0 || recommendations.length > 0 || studyPlan || flashcards.length > 0 || isProcessing) && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                الملخص
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                التحليل
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                البطاقات
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                التوصيات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookText className="h-5 w-5" />
                    ملخص الفيديو
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-3" />
                        <p className="text-red-700 font-medium">جاري تحليل فيديو يوتيوب...</p>
                        <p className="text-red-600 text-sm">استخراج المحتوى وإنشاء ملخص شامل</p>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                    </div>
                  ) : transcript ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{transcript}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Youtube className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>أدخل رابط فيديو يوتيوب واضغط "تحليل الفيديو"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              <div className="space-y-4">
                {keyPoints.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-5 w-5" />
                        النقاط الرئيسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {studyPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookText className="h-5 w-5" />
                        خطة الدراسة المقترحة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{studyPlan}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      البطاقات التعليمية ({flashcards.length})
                    </div>
                    <Button 
                      onClick={generateFlashcards}
                      disabled={isGeneratingCards || !transcript}
                      size="sm"
                      className="gap-2"
                    >
                      {isGeneratingCards ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4" />
                          إنشاء بطاقات
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGeneratingCards ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-3" />
                        <p className="text-red-700 font-medium">جاري إنشاء البطاقات من الفيديو...</p>
                      </div>
                    </div>
                  ) : flashcards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {flashcards.map((card, index) => (
                        <div key={card.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-red-600 font-medium mb-1">السؤال {index + 1}</p>
                              <p className="text-sm font-medium text-gray-900">{card.front}</p>
                            </div>
                            <Separator />
                            <div>
                              <p className="text-xs text-green-600 font-medium mb-1">الإجابة</p>
                              <p className="text-sm text-gray-700">{card.back}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>حلل فيديو أولاً ثم اضغط "إنشاء بطاقات"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5" />
                    التوصيات الدراسية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>حلل فيديو يوتيوب للحصول على توصيات دراسية مخصصة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!videoUrl && (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">مرحباً بك في تلخيص يوتيوب الذكي</p>
            <p className="text-gray-500">أدخل رابط فيديو يوتيوب وسيقوم الذكاء الاصطناعي بتحليله وإنشاء محتوى تعليمي شامل</p>
            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
              <span>📺 تحليل الفيديو</span>
              <span>📝 ملخص ذكي</span>
              <span>🎯 نقاط رئيسية</span>
              <span>📚 بطاقات تعليمية</span>
              <span>💡 توصيات</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YouTubeSummarizer;
