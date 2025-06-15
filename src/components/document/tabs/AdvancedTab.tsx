
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Lightbulb, Users } from "lucide-react";
import { SummaryData } from "../types";

interface AdvancedTabProps {
  summaryData: SummaryData | null;
}

const AdvancedTab = ({ summaryData }: AdvancedTabProps) => {
  return (
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
  );
};

export default AdvancedTab;
