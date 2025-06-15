
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import { SummaryData } from "../types";

interface MindMapTabProps {
  summaryData: SummaryData | null;
}

const MindMapTab = ({ summaryData }: MindMapTabProps) => {
  return (
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
  );
};

export default MindMapTab;
