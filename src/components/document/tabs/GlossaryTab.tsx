
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { SummaryData } from "../types";
import { getImportanceColor } from "../utils";

interface GlossaryTabProps {
  summaryData: SummaryData | null;
}

const GlossaryTab = ({ summaryData }: GlossaryTabProps) => {
  return (
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
  );
};

export default GlossaryTab;
