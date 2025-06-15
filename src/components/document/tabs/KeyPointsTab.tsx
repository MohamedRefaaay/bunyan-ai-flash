
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";
import { SummaryData } from "../types";

interface KeyPointsTabProps {
  summaryData: SummaryData | null;
}

const KeyPointsTab = ({ summaryData }: KeyPointsTabProps) => {
  return (
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
  );
};

export default KeyPointsTab;
