
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Target, Clock, TrendingUp, Zap } from "lucide-react";
import { SummaryData } from "../types";

interface StudyTipsTabProps {
  summaryData: SummaryData | null;
}

const StudyTipsTab = ({ summaryData }: StudyTipsTabProps) => {
  return (
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
  );
};

export default StudyTipsTab;
