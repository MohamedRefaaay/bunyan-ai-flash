
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { SummaryData } from "../types";
import { getDifficultyColor } from "../utils";

interface QuestionsTabProps {
  summaryData: SummaryData | null;
}

const QuestionsTab = ({ summaryData }: QuestionsTabProps) => {
  return (
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
  );
};

export default QuestionsTab;
