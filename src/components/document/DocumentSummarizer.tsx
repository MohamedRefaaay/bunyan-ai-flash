
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
  Brain, 
  Sparkles, 
  FileText,
  Target,
  Lightbulb,
  Map,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  PieChart,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface DocumentSummarizerProps {
  documentContent: string;
  fileName: string;
}

interface SummaryData {
  mainSummary: string;
  keyPoints: string[];
  mindMap: {
    topic: string;
    branches: Array<{
      title: string;
      points: string[];
      note: string;
    }>;
  };
  studyTips: string[];
  examPreparation: string[];
  // الميزات الجديدة
  difficultyConcepts: Array<{
    concept: string;
    explanation: string;
    level: 'easy' | 'medium' | 'hard';
  }>;
  timeEstimate: {
    studyTime: string;
    reviewTime: string;
    practiceTime: string;
  };
  relatedTopics: string[];
  practiceQuestions: Array<{
    question: string;
    type: 'multiple-choice' | 'essay' | 'short-answer';
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  keyTermsGlossary: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  learningObjectives: string[];
  commonMistakes: Array<{
    mistake: string;
    correction: string;
    tip: string;
  }>;
}

const DocumentSummarizer = ({ documentContent, fileName }: DocumentSummarizerProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateComprehensiveSummary = async () => {
    if (!documentContent) {
      toast.error("لا يوجد محتوى لتحليله.");
      return;
    }

    const geminiApiKey = localStorage.getItem("gemini_api_key");
    if (!geminiApiKey) {
      toast.error("الرجاء إدخال مفتاح Gemini API الخاص بك في علامة تبويب الإعدادات أولاً.");
      return;
    }

    setIsAnalyzing(true);
    setSummaryData(null);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    const comprehensivePrompt = `
أنت خبير تعليمي متقدم متخصص في التحليل الشامل للمواد الدراسية. مهمتك هي تقديم تحليل متكامل ومتقدم للمستند التالي:

الغرض والأهداف المتقدمة:
- تحليل عميق للمفاهيم والنظريات
- تحديد مستويات الصعوبة للمفاهيم المختلفة
- تقدير الوقت المناسب للدراسة والمراجعة
- إنشاء أسئلة تطبيقية متنوعة
- تحديد المصطلحات الرئيسية مع تعريفاتها
- تحديد الأهداف التعليمية الواضحة
- تحليل الأخطاء الشائعة وكيفية تجنبها
- ربط الموضوع بمواضيع أخرى ذات صلة

المستند المراد تحليله:
---
${documentContent}
---

المطلوب تحليل شامل ومتقدم يتضمن:

1. ملخص رئيسي شامل ومركز (3-5 فقرات)
2. النقاط الرئيسية والمفاهيم الأساسية (5-10 نقاط)
3. خريطة ذهنية منظمة تربط بين المفاهيم
4. نصائح دراسية مخصصة
5. استراتيجيات الاستعداد للاختبارات
6. تحليل المفاهيم الصعبة مع مستوى الصعوبة
7. تقدير الوقت المطلوب للدراسة والمراجعة والممارسة
8. مواضيع ذات صلة للتوسع
9. أسئلة تطبيقية متنوعة (اختيار متعدد، مقالية، إجابات قصيرة)
10. قاموس المصطلحات الرئيسية
11. الأهداف التعليمية الواضحة
12. الأخطاء الشائعة وكيفية تجنبها

تنسيق الإجابة بـ JSON:
{
  "mainSummary": "الملخص الرئيسي الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...],
  "mindMap": {
    "topic": "الموضوع الرئيسي",
    "branches": [
      {
        "title": "عنوان الفرع",
        "points": ["نقطة 1", "نقطة 2"],
        "note": "ملحوظة لتذكر المعلومة الأساسية"
      }
    ]
  },
  "studyTips": ["نصيحة دراسية 1", "نصيحة دراسية 2", ...],
  "examPreparation": ["استراتيجية اختبار 1", "استراتيجية اختبار 2", ...],
  "difficultyConcepts": [
    {
      "concept": "اسم المفهوم",
      "explanation": "شرح مبسط للمفهوم",
      "level": "easy|medium|hard"
    }
  ],
  "timeEstimate": {
    "studyTime": "الوقت المقدر للدراسة الأولى",
    "reviewTime": "الوقت المقدر للمراجعة",
    "practiceTime": "الوقت المقدر للممارسة"
  },
  "relatedTopics": ["موضوع ذو صلة 1", "موضوع ذو صلة 2", ...],
  "practiceQuestions": [
    {
      "question": "نص السؤال",
      "type": "multiple-choice|essay|short-answer",
      "difficulty": "easy|medium|hard"
    }
  ],
  "keyTermsGlossary": [
    {
      "term": "المصطلح",
      "definition": "تعريف المصطلح",
      "importance": "high|medium|low"
    }
  ],
  "learningObjectives": ["الهدف التعليمي 1", "الهدف التعليمي 2", ...],
  "commonMistakes": [
    {
      "mistake": "الخطأ الشائع",
      "correction": "التصحيح",
      "tip": "نصيحة لتجنب الخطأ"
    }
  ]
}

تأكد من:
- استخدام لغة احترافية وموجزة باللغة العربية
- تنويع مستويات الصعوبة في الأسئلة والمفاهيم
- تقديم تقديرات زمنية واقعية
- ربط المواضيع ببعضها البعض
- التركيز على الجوانب العملية والتطبيقية
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
          const cleanJson = analysisText.replace(/```json|```/g, '').trim();
          const analysisData = JSON.parse(cleanJson);
          
          setSummaryData(analysisData);
          toast.success("تم إنشاء التحليل الشامل المتقدم بنجاح!");
        } catch {
          toast.error("خطأ في تحليل استجابة Gemini API");
        }
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summaryData) {
      toast.error("لا يوجد محتوى لتنزيله.");
      return;
    }
    
    const fullContent = `
تحليل شامل متقدم للمستند: ${fileName}
=====================================

الملخص الرئيسي:
${summaryData.mainSummary}

النقاط الرئيسية:
${summaryData.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

الأهداف التعليمية:
${summaryData.learningObjectives?.map((objective, i) => `${i + 1}. ${objective}`).join('\n') || 'غير متوفر'}

تحليل المفاهيم الصعبة:
${summaryData.difficultyConcepts?.map((concept, i) => `
${i + 1}. ${concept.concept} (مستوى: ${concept.level})
   الشرح: ${concept.explanation}
`).join('\n') || 'غير متوفر'}

تقدير الوقت:
- وقت الدراسة الأولى: ${summaryData.timeEstimate?.studyTime || 'غير محدد'}
- وقت المراجعة: ${summaryData.timeEstimate?.reviewTime || 'غير محدد'}
- وقت الممارسة: ${summaryData.timeEstimate?.practiceTime || 'غير محدد'}

الخريطة الذهنية:
الموضوع الرئيسي: ${summaryData.mindMap.topic}

الفروع:
${summaryData.mindMap.branches.map((branch, i) => `
${i + 1}. ${branch.title}
   النقاط:
   ${branch.points.map(point => `   - ${point}`).join('\n')}
   ملحوظة: ${branch.note}
`).join('\n')}

قاموس المصطلحات:
${summaryData.keyTermsGlossary?.map((term, i) => `
${i + 1}. ${term.term} (أهمية: ${term.importance})
   التعريف: ${term.definition}
`).join('\n') || 'غير متوفر'}

أسئلة تطبيقية:
${summaryData.practiceQuestions?.map((q, i) => `
${i + 1}. ${q.question}
   النوع: ${q.type} | المستوى: ${q.difficulty}
`).join('\n') || 'غير متوفر'}

الأخطاء الشائعة:
${summaryData.commonMistakes?.map((mistake, i) => `
${i + 1}. الخطأ: ${mistake.mistake}
   التصحيح: ${mistake.correction}
   النصيحة: ${mistake.tip}
`).join('\n') || 'غير متوفر'}

النصائح الدراسية:
${summaryData.studyTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

استراتيجيات الاستعداد للاختبارات:
${summaryData.examPreparation.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

مواضيع ذات صلة:
${summaryData.relatedTopics?.map((topic, i) => `${i + 1}. ${topic}`).join('\n') || 'غير متوفر'}

تم إنشاء هذا التحليل الشامل باستخدام الذكاء الاصطناعي Gemini المتقدم
    `;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(fullContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `comprehensive_analysis_${fileName}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل التحليل الشامل!");
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl">التحليل الذكي الشامل المتقدم</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              مدعوم بـ Gemini AI
            </Badge>
          </div>
          {summaryData && !isAnalyzing && (
             <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
                <Download className="h-4 w-4" />
                تنزيل التحليل الشامل
             </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button 
            onClick={generateComprehensiveSummary} 
            disabled={isAnalyzing || !documentContent} 
            className="gap-2 bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحليل الشامل المتقدم...
              </>
            ) : (
              <>
                <BookText className="h-4 w-4" />
                بدء التحليل الذكي الشامل
              </>
            )}
          </Button>
        </div>

        {(summaryData || isAnalyzing) && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full text-xs">
              <TabsTrigger value="summary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="hidden md:inline">الملخص</span>
              </TabsTrigger>
              <TabsTrigger value="keypoints" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span className="hidden md:inline">النقاط الرئيسية</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex items-center gap-1">
                <Map className="h-3 w-3" />
                <span className="hidden md:inline">الخريطة الذهنية</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                <span className="hidden md:inline">النصائح</span>
              </TabsTrigger>
              <TabsTrigger value="concepts" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span className="hidden md:inline">المفاهيم الصعبة</span>
              </TabsTrigger>
              <TabsTrigger value="glossary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="hidden md:inline">المصطلحات</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span className="hidden md:inline">أسئلة تطبيقية</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="hidden md:inline">تحليل متقدم</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookText className="h-5 w-5" />
                    الملخص الرئيسي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-3" />
                        <p className="text-purple-700 font-medium">Gemini AI يحلل المستند بشكل شامل...</p>
                        <p className="text-purple-600 text-sm">جاري إنشاء تحليل متقدم ومتكامل</p>
                      </div>
                    </div>
                  ) : summaryData?.mainSummary ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summaryData.mainSummary}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>اضغط على "بدء التحليل الذكي الشامل" لإنشاء تحليل متقدم</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keypoints" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" />
                      النقاط والمفاهيم الرئيسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {summaryData?.keyPoints ? (
                      <ul className="space-y-3">
                        {summaryData.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>ابدأ التحليل لاستخراج النقاط الرئيسية</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {summaryData?.learningObjectives && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5" />
                        الأهداف التعليمية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {summaryData.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mindmap" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Map className="h-5 w-5" />
                    الخريطة الذهنية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryData?.mindMap ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-purple-800 bg-purple-100 rounded-lg p-3">
                          {summaryData.mindMap.topic}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summaryData.mindMap.branches.map((branch, index) => (
                          <div key={index} className="border border-purple-200 rounded-lg p-4 bg-white">
                            <h4 className="font-semibold text-purple-700 mb-3">{branch.title}</h4>
                            <ul className="space-y-2 mb-3">
                              {branch.points.map((point, pointIndex) => (
                                <li key={pointIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                            <div className="border-t border-purple-100 pt-2">
                              <p className="text-xs text-purple-600 font-medium">
                                💡 ملحوظة: {branch.note}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Map className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>ابدأ التحليل لإنشاء الخريطة الذهنية</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="mt-4">
              <div className="space-y-4">
                {summaryData?.studyTips && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5" />
                        النصائح الدراسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {summaryData.studyTips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {summaryData?.examPreparation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-5 w-5" />
                        استراتيجيات الاستعداد للاختبارات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {summaryData.examPreparation.map((strategy, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 text-sm">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {summaryData?.timeEstimate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5" />
                        تقدير الوقت المطلوب
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="font-medium text-blue-800">وقت الدراسة الأولى</p>
                          <p className="text-blue-600">{summaryData.timeEstimate.studyTime}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="font-medium text-green-800">وقت المراجعة</p>
                          <p className="text-green-600">{summaryData.timeEstimate.reviewTime}</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <p className="font-medium text-yellow-800">وقت الممارسة</p>
                          <p className="text-yellow-600">{summaryData.timeEstimate.practiceTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="concepts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" />
                    تحليل المفاهيم الصعبة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryData?.difficultyConcepts ? (
                    <div className="space-y-4">
                      {summaryData.difficultyConcepts.map((concept, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">{concept.concept}</h4>
                            <Badge className={getDifficultyColor(concept.level)}>
                              {concept.level === 'easy' ? 'سهل' : concept.level === 'medium' ? 'متوسط' : 'صعب'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{concept.explanation}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>ابدأ التحليل لتحديد المفاهيم الصعبة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="glossary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    قاموس المصطلحات الرئيسية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryData?.keyTermsGlossary ? (
                    <div className="space-y-3">
                      {summaryData.keyTermsGlossary.map((term, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{term.term}</h4>
                            <Badge className={getImportanceColor(term.importance)}>
                              {term.importance === 'high' ? 'عالية الأهمية' : term.importance === 'medium' ? 'متوسطة الأهمية' : 'منخفضة الأهمية'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>ابدأ التحليل لإنشاء قاموس المصطلحات</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5" />
                    أسئلة تطبيقية متنوعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryData?.practiceQuestions ? (
                    <div className="space-y-4">
                      {summaryData.practiceQuestions.map((question, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-gray-800 flex-1">{question.question}</p>
                            <div className="flex gap-2 ml-3">
                              <Badge variant="outline" className="text-xs">
                                {question.type === 'multiple-choice' ? 'اختيار متعدد' : 
                                 question.type === 'essay' ? 'مقالي' : 'إجابة قصيرة'}
                              </Badge>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty === 'easy' ? 'سهل' : 
                                 question.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>ابدأ التحليل لإنشاء أسئلة تطبيقية</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="mt-4">
              <div className="space-y-4">
                {summaryData?.commonMistakes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertCircle className="h-5 w-5" />
                        الأخطاء الشائعة وكيفية تجنبها
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {summaryData.commonMistakes.map((mistake, index) => (
                          <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-red-800">الخطأ الشائع:</p>
                                  <p className="text-red-700 text-sm">{mistake.mistake}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-green-800">التصحيح:</p>
                                  <p className="text-green-700 text-sm">{mistake.correction}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-blue-800">نصيحة:</p>
                                  <p className="text-blue-700 text-sm">{mistake.tip}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {summaryData?.relatedTopics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5" />
                        مواضيع ذات صلة للتوسع
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {summaryData.relatedTopics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!documentContent && (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">مرحباً بك في التحليل الذكي الشامل المتقدم</p>
            <p className="text-gray-500">ارفع ملف PDF أو Word لبدء التحليل الشامل والمتقدم</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
              <span>📄 ملخص شامل</span>
              <span>🎯 نقاط رئيسية</span>
              <span>🗺️ خريطة ذهنية</span>
              <span>💡 نصائح دراسية</span>
              <span>⚠️ مفاهيم صعبة</span>
              <span>📚 قاموس مصطلحات</span>
              <span>❓ أسئلة تطبيقية</span>
              <span>📈 تحليل متقدم</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentSummarizer;
