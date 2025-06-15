
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BookOpen } from 'lucide-react';

interface YouTubeSummaryTabsProps {
  summary: string;
  keyPoints: string[];
}

const YouTubeSummaryTabs: React.FC<YouTubeSummaryTabsProps> = ({ summary, keyPoints }) => {
  if (!summary && (!keyPoints || keyPoints.length === 0)) return null;

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          الملخص
        </TabsTrigger>
        <TabsTrigger value="points" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          النقاط الرئيسية
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-3">ملخص الفيديو:</h3>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      </TabsContent>

      <TabsContent value="points" className="mt-4">
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-3">النقاط الرئيسية:</h3>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-600 font-medium">{index + 1}.</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default YouTubeSummaryTabs;
