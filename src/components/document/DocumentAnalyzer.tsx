
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Brain } from "lucide-react";
import DocumentUploader from "./DocumentUploader";
import DocumentSummarizer from "./DocumentSummarizer";
import type { Flashcard } from "@/types/flashcard";

interface DocumentAnalyzerProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
}

const DocumentAnalyzer = ({ onFlashcardsGenerated }: DocumentAnalyzerProps) => {
  const [documentContent, setDocumentContent] = useState("");
  const [fileName, setFileName] = useState("");

  const handleDocumentProcessed = (content: string, name: string) => {
    setDocumentContent(content);
    setFileName(name);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Brain className="h-6 w-6" />
          محلل ومُلخص المستندات الذكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              رفع المستند
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2" disabled={!documentContent}>
              <Brain className="h-4 w-4" />
              التحليل والتلخيص
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <DocumentUploader onDocumentProcessed={handleDocumentProcessed} />
          </TabsContent>

          <TabsContent value="analyze" className="mt-4">
            <DocumentSummarizer 
              documentContent={documentContent} 
              fileName={fileName}
              onFlashcardsGenerated={onFlashcardsGenerated}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalyzer;
