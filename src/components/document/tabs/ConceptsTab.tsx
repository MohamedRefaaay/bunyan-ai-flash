
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { SummaryData } from "../types";
import { getDifficultyColor } from "../utils";

interface ConceptsTabProps {
  summaryData: SummaryData | null;
}

const ConceptsTab = ({ summaryData }: ConceptsTabProps) => {
  return (
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
  );
};

export default ConceptsTab;
