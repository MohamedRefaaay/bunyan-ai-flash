
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookText } from "lucide-react";
import { SummaryData } from "../types";

interface SummaryTabProps {
  isAnalyzing: boolean;
  summaryData: SummaryData | null;
}

const SummaryTab = ({ isAnalyzing, summaryData }: SummaryTabProps) => {
  return (
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
  );
};

export default SummaryTab;
