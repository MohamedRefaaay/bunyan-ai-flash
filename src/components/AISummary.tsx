
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  BookText, 
  Download, 
  Bot, 
  Sparkles, 
  BarChart3, 
  Users, 
  Lightbulb, 
  Image,
  FileText,
  Brain,
  Target,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import type { Flashcard } from "@/types/flashcard";

interface AISummaryProps {
  transcript: string;
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void;
}

const AISummary = ({ transcript, onFlashcardsGenerated }: AISummaryProps) => {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [cardCount, setCardCount] = useState("10");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateCompleteSummary = async () => {
    if (!transcript) {
      toast.error("يرجى تقديم محتوى لتحليله أولاً.");
      return;
    }

    const geminiApiKey = localStorage.getItem("gemini_api_key");
    if (!geminiApiKey) {
      toast.error("الرجاء إدخال مفتاح Gemini API الخاص بك في علامة تبويب الإعدادات أولاً.");
      return;
    }

    setIsAnalyzing(true);
    setSummary("");
    setKeyPoints([]);
    setRecommendations([]);
    setStudyPlan("");

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    const comprehensivePrompt = `
أنت خبير تعليمي ومحلل محتوى متقدم. قم بتحليل النص التالي وتقديم تحليل شامل ومفصل:

النص المراد تحليله:
---
${transcript}
---

المطلوب:
1. ملخص شامل ومركز للمحتوى (3-4 فقرات)
2. النقاط الرئيسية والمفاهيم المهمة (5-8 نقاط)
3. توصيات دراسية مخصصة (4-6 توصيات)
4. خطة دراسية مقترحة لإتقان هذا المحتوى

تنسيق الإجابة بـ JSON:
{
  "summary": "الملخص الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...],
  "recommendations": ["التوصية الأولى", "التوصية الثانية", ...],
  "studyPlan": "خطة الدراسة المفصلة هنا"
}

تأكد من أن جميع المحتويات باللغة العربية ومفيدة تعليمياً.
`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: comprehensivePrompt }] }],
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate analysis.");
      }

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const analysisText = result.candidates[0].content.parts[0].text;
        
        try {
          // Try to parse as JSON first
          const cleanJson = analysisText.replace(/```json|```/g, '').trim();
          const analysisData = JSON.parse(cleanJson);
          
          setSummary(analysisData.summary);
          setKeyPoints(analysisData.keyPoints || []);
          setRecommendations(analysisData.recommendations || []);
          setStudyPlan(analysisData.studyPlan);
        } catch {
          // If JSON parsing fails, use the raw text as summary
          setSummary(analysisText);
        }
        
        toast.success("تم إنشاء التحليل الشامل بنجاح!");
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred while generating the analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFlashcards = async () => {
    if (!transcript) {
      toast.error("يرجى تقديم محتوى لإنشاء البطاقات.");
      return;
    }

    const openAIApiKey = localStorage.getItem("openai_api_key");
    if (!openAIApiKey) {
      toast.error("الرجاء إدخال مفتاح OpenAI API في صفحة الإعدادات أولاً.");
      return;
    }

    setIsGeneratingCards(true);
    
    try {
      const systemPrompt = `You are an expert in creating educational flashcards from a given text.
Your task is to generate ${cardCount} flashcards based on the provided transcript.
The difficulty level should be '${difficulty}'.
The language of the flashcards should be Arabic.

Please provide the output as a single JSON object with a key "flashcards" which contains an array of flashcard objects.
Each flashcard object in the array must have 'front' and 'back' string properties.
Example format: {"flashcards": [{"front": "Question 1", "back": "Answer 1"}, {"front": "Question 2", "back": "Answer 2"}]}

Do not include any other text, explanations, or markdown formatting in your response. The entire response should be only the JSON object.`;
        
      const userPrompt = `Transcript:\n---\n${transcript}\n---\nPlease generate the flashcards now.`;

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
                { role: 'user', content: userPrompt }
              ],
              response_format: { type: "json_object" },
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API Error: ${errorData?.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const content = JSON.parse(result.choices[0].message.content);
      const generatedCards = content.flashcards;

      if (!Array.isArray(generatedCards)) {
          throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء بطاقات بالتنسيق الصحيح.");
      }

      const newFlashcards: Flashcard[] = generatedCards.map((card: any, i: number) => ({
          id: `card-${Date.now()}-${i}`,
          front: card.front || " ",
          back: card.back || " ",
          type: "basic" as const,
          difficulty: difficulty as "easy" | "medium" | "hard"
      }));

      setFlashcards(newFlashcards);
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(newFlashcards);
      }
      toast.success(`تم إنشاء ${newFlashcards.length} بطاقة تعليمية بنجاح!`);
    } catch (error) {
      console.error("خطأ في إنشاء البطاقات:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء البطاقات");
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) {
      toast.error("لا يوجد محتوى لتنزيله.");
      return;
    }
    
    const fullContent = `
تحليل شامل للمحتوى التعليمي
=====================================

الملخص:
${summary}

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
    downloadAnchorNode.setAttribute("download", "comprehensive_analysis.txt");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل التحليل الشامل!");
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl">التحليل الذكي الشامل</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              مدعوم بالذكاء الاصطناعي
            </Badge>
          </div>
          {(summary || flashcards.length > 0) && !isAnalyzing && !isGeneratingCards && (
             <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
                <Download className="h-4 w-4" />
                تنزيل التحليل الكامل
             </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={generateCompleteSummary} 
            disabled={isAnalyzing || !transcript} 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحليل الشامل...
              </>
            ) : (
              <>
                <BookText className="h-4 w-4" />
                بدء التحليل الذكي الشامل
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
            <select 
              value={cardCount} 
              onChange={(e) => setCardCount(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="5">5 بطاقات</option>
              <option value="10">10 بطاقات</option>
              <option value="15">15 بطاقة</option>
              <option value="20">20 بطاقة</option>
            </select>
          </div>
        </div>

        {(summary || keyPoints.length > 0 || recommendations.length > 0 || studyPlan || flashcards.length > 0 || isAnalyzing || isGeneratingCards) && (
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
                    الملخص الشامل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-blue-700 font-medium">الذكاء الاصطناعي يحلل المحتوى...</p>
                        <p className="text-blue-600 text-sm">جاري إنشاء ملخص شامل ومفصل</p>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>اضغط على "بدء التحليل الذكي الشامل" لإنشاء ملخص مفصل</p>
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
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
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
                        <BarChart3 className="h-5 w-5" />
                        خطة الدراسة المقترحة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
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
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-blue-700 font-medium">جاري إنشاء البطاقات التعليمية...</p>
                      </div>
                    </div>
                  ) : flashcards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {flashcards.map((card, index) => (
                        <div key={card.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-blue-600 font-medium mb-1">السؤال {index + 1}</p>
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
                      <p>اضغط على "إنشاء بطاقات" لإنشاء بطاقات تعليمية ذكية</p>
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
                    التوصيات الدراسية الذكية
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
                      <p>ابدأ التحليل الشامل للحصول على توصيات دراسية مخصصة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!transcript && (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">مرحباً بك في التحليل الذكي الشامل</p>
            <p className="text-gray-500">ارفع ملفاً صوتياً أو أدخل نصاً لبدء التحليل الذكي وإنشاء محتوى تعليمي متقدم</p>
            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
              <span>✨ ملخص ذكي</span>
              <span>🎯 نقاط رئيسية</span>
              <span>📚 بطاقات تعليمية</span>
              <span>💡 توصيات مخصصة</span>
              <span>📋 خطة دراسية</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummary;
