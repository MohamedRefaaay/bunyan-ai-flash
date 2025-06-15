import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { SummaryData, DocumentSummarizerProps as OriginalDocSummarizerProps } from "./types";
import { generateComprehensivePrompt, generateDownloadContent } from "./utils";
import { makeAIRequest, getAIProviderConfig } from "@/utils/aiProviders";
import SummaryTab from "./tabs/SummaryTab";
import KeyPointsTab from "./tabs/KeyPointsTab";
import MindMapTab from "./tabs/MindMapTab";
import StudyTipsTab from "./tabs/StudyTipsTab";
import ConceptsTab from "./tabs/ConceptsTab";
import GlossaryTab from "./tabs/GlossaryTab";
import QuestionsTab from "./tabs/QuestionsTab";
import AdvancedTab from "./tabs/AdvancedTab";
import { supabase } from "@/integrations/supabase/client";
import type { Flashcard } from "@/types/flashcard";

interface DocumentSummarizerProps extends OriginalDocSummarizerProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  sessionId: string | null;
}

const DocumentSummarizer = ({ documentContent, fileName, onFlashcardsGenerated, sessionId }: DocumentSummarizerProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  const generateComprehensiveSummary = async () => {
    if (!documentContent) {
      toast.error("لا يوجد محتوى لتحليله.");
      return;
    }

    setIsAnalyzing(true);
    setSummaryData(null);

    const comprehensivePrompt = generateComprehensivePrompt(documentContent);

    try {
      const analysisText = await makeAIRequest(comprehensivePrompt, {
        systemPrompt: `أنت محلل مستندات ذكي متخصص في إنشاء تحليلات شاملة ومفصلة. يجب أن تكون إجابتك بصيغة JSON صحيحة فقط، بدون أي نص إضافي.`
      });
      
      try {
        const cleanJson = analysisText.replace(/```json|```/g, '').trim();
        const analysisData = JSON.parse(cleanJson);
        
        setSummaryData(analysisData);
        
        if (sessionId) {
          const summaryText = analysisData?.summary?.narrative_summary || analysisData?.mainSummary || '';
          const { error: updateError } = await supabase
            .from('sessions')
            .update({
              summary: summaryText,
              status: 'summarized'
            })
            .eq('id', sessionId);
          
          if (updateError) {
             console.error("Error updating session:", updateError);
             throw new Error('فشل تحديث الجلسة بالملخص.');
          }
          toast.success("تم إنشاء التحليل الشامل وتحديث الجلسة بنجاح!");
        } else {
           toast.warn("تم إنشاء التحليل ولكن لم يتم العثور على جلسة لتحديثها.");
        }

      } catch (e){
        console.error("Error parsing AI response or saving session", e);
        toast.error("خطأ في تحليل استجابة الذكاء الاصطناعي أو حفظ الجلسة");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFlashcardsFromDocument = async () => {
    if (!summaryData || !sessionId) {
      toast.error('يرجى تحليل المستند أولاً لإنشاء البطاقات');
      return;
    }

    const config = getAIProviderConfig();
    if (!config) {
      toast.error("الرجاء إدخال مفتاح API في الإعدادات أولاً.");
      return;
    }

    setIsGeneratingCards(true);

    try {
      const flashcardPrompt = `بناءً على تحليل هذا المستند، قم بإنشاء 12 بطاقة تعليمية:

${generateDownloadContent(summaryData, fileName)}

يجب أن تكون الإجابة بصيغة JSON فقط مع هذا التنسيق:
[
  {
    "id": "1",
    "front": "السؤال هنا", 
    "back": "الإجابة هنا",
    "difficulty": "medium",
    "category": "مستند",
    "tags": ["ملخص", "${fileName}"],
    "source": "Document"
  }
]

تأكد من تنويع أنواع الأسئلة وتغطية المحتوى بشكل شامل.`;

      const flashcardsResult = await makeAIRequest(flashcardPrompt, {
        systemPrompt: 'أنت خبير في إنشاء البطاقات التعليمية من المستندات. أجب بصيغة JSON صحيحة فقط.'
      });

      const cleanJson = flashcardsResult.replace(/```json|```/g, '').trim();
      const flashcards: any[] = JSON.parse(cleanJson);
      
      if (Array.isArray(flashcards)) {
        onFlashcardsGenerated(flashcards as Flashcard[]);
      } else {
        throw new Error('تنسيق غير صحيح للبطاقات');
      }
    } catch (error) {
      console.error('Error generating flashcards from document:', error);
      toast.error('حدث خطأ في إنشاء البطاقات');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summaryData) {
      toast.error("لا يوجد محتوى لتنزيله.");
      return;
    }
    
    const fullContent = generateDownloadContent(summaryData, fileName);
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(fullContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `comprehensive_analysis_${fileName}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("تم بدء تنزيل التحليل الشامل!");
  };

  const config = getAIProviderConfig();

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl">التحليل الذكي الشامل المتقدم</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              {config ? `مدعوم بـ ${config.provider.toUpperCase()}` : 'غير متصل'}
            </Badge>
          </div>
          <div className="flex gap-2">
            {!config && (
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings"} className="gap-2">
                <Settings className="h-4 w-4" />
                إعدادات API
              </Button>
            )}
            {summaryData && !isAnalyzing && (
               <Button variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-2">
                  <Download className="h-4 w-4" />
                  تنزيل التحليل الشامل
               </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button 
            onClick={generateComprehensiveSummary} 
            disabled={isAnalyzing || !documentContent || !config} 
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

        {!config && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">مطلوب إعداد مزود الذكاء الاصطناعي</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  يرجى الذهاب إلى الإعدادات وإدخال مفتاح API لأحد مزودي الذكاء الاصطناعي
                </p>
              </div>
            </div>
          </div>
        )}

        {summaryData && !isAnalyzing && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={generateFlashcardsFromDocument}
                disabled={isGeneratingCards || !sessionId}
                className="gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGeneratingCards ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري إنشاء البطاقات...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    إنشاء بطاقات تعليمية من المستند
                  </>
                )}
              </Button>
            </div>
          )}

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
              <SummaryTab isAnalyzing={isAnalyzing} summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="keypoints" className="mt-4">
              <KeyPointsTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="mindmap" className="mt-4">
              <MindMapTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="tips" className="mt-4">
              <StudyTipsTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="concepts" className="mt-4">
              <ConceptsTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="glossary" className="mt-4">
              <GlossaryTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="questions" className="mt-4">
              <QuestionsTab summaryData={summaryData} />
            </TabsContent>

            <TabsContent value="advanced" className="mt-4">
              <AdvancedTab summaryData={summaryData} />
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
