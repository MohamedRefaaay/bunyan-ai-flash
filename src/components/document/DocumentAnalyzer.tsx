
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Brain, Loader2 } from "lucide-react";
import DocumentSummarizer from "./DocumentSummarizer";
import type { Flashcard } from "@/types/flashcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Buffer } from 'buffer';

interface DocumentAnalyzerProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
}

const DocumentAnalyzer = ({ onFlashcardsGenerated }: DocumentAnalyzerProps) => {
  const [documentContent, setDocumentContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentProcessed = (content: string, name: string) => {
    setDocumentContent(content);
    setFileName(name);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        const pdf = (await import('pdf-parse')).default;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdf(buffer);
        if (!data || !data.text) {
          throw new Error("لم يتمكن من استخراج أي نص من ملف PDF.");
        }
        return data.text;
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        if (error instanceof Error && error.message.includes('fs.readFileSync')) {
             throw new Error("حدث خطأ توافق مع المتصفح عند معالجة PDF.");
        }
        throw new Error("فشل في استخراج النص من ملف PDF. قد يكون الملف محمياً أو تالفاً.");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
        let text = '';
        if (file.type === 'application/pdf') {
            text = await extractTextFromPDF(file);
        } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
            text = await file.text();
        } else {
            toast.error('نوع الملف غير مدعوم حالياً. يرجى استخدام PDF, TXT, أو MD.');
            setIsProcessing(false);
            return;
        }
        handleDocumentProcessed(text, file.name);
        toast.success(`تمت معالجة الملف ${file.name} بنجاح.`);
    } catch (error) {
        console.error("خطأ في معالجة الملف:", error);
        toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الملف.');
    } finally {
        setIsProcessing(false);
    }
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
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-purple-200 p-8 text-center">
              <Upload className="h-12 w-12 text-purple-400" />
              <h3 className="text-xl font-semibold text-purple-900">
                ارفع مستندك هنا
              </h3>
              <p className="text-sm text-purple-700">
                اسحب وأفلت الملف هنا، أو انقر للتصفح
                <br />
                (يدعم PDF, TXT, MD)
              </p>
              <Input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".pdf,.txt,.md"
                disabled={isProcessing}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    اختر ملفاً
                  </>
                )}
              </Button>
            </div>
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
