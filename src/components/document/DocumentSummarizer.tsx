
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
  BookOpen
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
أنت خبير تعليمي متخصص في تلخيص المواد الدراسية المعقدة. مهمتك هي تحليل المستند التالي وتقديم تلخيص شامل واحترافي وفقاً للاستراتيجية التالية:

الغرض والأهداف:
- مساعدة المستخدمين على فهم المواد الدراسية المعقدة
- تقديم ملخصات دقيقة ومفيدة تساعد على الاستعداد للاختبارات
- تحديد النقاط الرئيسية والمفاهيم الأساسية
- تحليل الموضوعات من جوانب متعددة (التعريف، الأهمية، الآليات، العيوب والمميزات)
- الربط بين المفاهيم المختلفة
- تتبع التطور التاريخي للنظريات والمفاهيم
- تصنيف المعلومات لتسهيل الفهم والحفظ

المستند المراد تحليله:
---
${documentContent}
---

المطلوب تحليل شامل يتضمن:

1. ملخص رئيسي شامل ومركز (3-5 فقرات)
2. النقاط الرئيسية والمفاهيم الأساسية (5-10 نقاط)
3. خريطة ذهنية منظمة تربط بين المفاهيم
4. نصائح دراسية مخصصة
5. استراتيجيات الاستعداد للاختبارات

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
  "examPreparation": ["استراتيجية اختبار 1", "استراتيجية اختبار 2", ...]
}

تأكد من:
- استخدام لغة احترافية وموجزة باللغة العربية
- تجنب التكرار وتقديم المعلومات بطريقة منظمة
- تسليط الضوء على المصطلحات الرئيسية والمفاهيم الأساسية
- إضافة ملحوظة موجزة في نهاية كل نقطة لتذكر المعلومة الأساسية
- ربط المفاهيم ببعضها البعض
- تصنيف المعلومات بطريقة منطقية
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
          toast.success("تم إنشاء التلخيص الشامل بنجاح!");
        } catch {
          toast.error("خطأ في تحليل استجابة Gemini API");
        }
      } else {
        throw new Error("Invalid response structure from Gemini API.");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء التلخيص");
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
تلخيص شامل للمستند: ${fileName}
=====================================

الملخص الرئيسي:
${summaryData.mainSummary}

النقاط الرئيسية:
${summaryData.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

الخريطة الذهنية:
الموضوع الرئيسي: ${summaryData.mindMap.topic}

الفروع:
${summaryData.mindMap.branches.map((branch, i) => `
${i + 1}. ${branch.title}
   النقاط:
   ${branch.points.map(point => `   - ${point}`).join('\n')}
   ملحوظة: ${branch.note}
`).join('\n')}

النصائح الدراسية:
${summaryData.studyTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

استراتيجيات الاستعداد للاختبارات:
${summaryData.examPreparation.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

تم إنشاء هذا التلخيص باستخدام الذكاء الاصطناعي Gemini
    `;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(fullContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `summary_${fileName}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل التلخيص!");
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl">التلخيص الذكي للمستندات</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              مدعوم بـ Gemini AI
            </Badge>
          </div>
          {summaryData && !isAnalyzing && (
             <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
                <Download className="h-4 w-4" />
                تنزيل التلخيص
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
                جاري التحليل الذكي...
              </>
            ) : (
              <>
                <BookText className="h-4 w-4" />
                بدء التلخيص الذكي
              </>
            )}
          </Button>
        </div>

        {(summaryData || isAnalyzing) && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                الملخص
              </TabsTrigger>
              <TabsTrigger value="keypoints" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                النقاط الرئيسية
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                الخريطة الذهنية
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                النصائح
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
                        <p className="text-purple-700 font-medium">Gemini AI يحلل المستند...</p>
                        <p className="text-purple-600 text-sm">جاري إنشاء ملخص شامل واحترافي</p>
                      </div>
                    </div>
                  ) : summaryData?.mainSummary ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summaryData.mainSummary}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>اضغط على "بدء التلخيص الذكي" لإنشاء ملخص شامل</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keypoints" className="mt-4">
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

                {!summaryData?.studyTips && !summaryData?.examPreparation && (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>ابدأ التحليل للحصول على نصائح دراسية مخصصة</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!documentContent && (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">مرحباً بك في التلخيص الذكي للمستندات</p>
            <p className="text-gray-500">ارفع ملف PDF أو Word لبدء التحليل والتلخيص الذكي</p>
            <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
              <span>📄 ملخص شامل</span>
              <span>🎯 نقاط رئيسية</span>
              <span>🗺️ خريطة ذهنية</span>
              <span>💡 نصائح دراسية</span>
              <span>📋 استراتيجيات اختبارات</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentSummarizer;
