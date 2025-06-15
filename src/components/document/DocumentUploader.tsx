
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentUploaderProps {
  onDocumentProcessed: (content: string, fileName: string) => void;
}

const DocumentUploader = ({ onDocumentProcessed }: DocumentUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const validateDocumentFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    return validTypes.includes(file.type);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // استخدام FileReader لقراءة ملف PDF
      const arrayBuffer = await file.arrayBuffer();
      
      // استخدام مكتبة pdf-parse المتاحة
      const pdfParse = await import('pdf-parse');
      const data = await pdfParse.default(arrayBuffer);
      
      return data.text;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      // في حالة فشل استخراج النص، نقترح على المستخدم نسخ النص يدوياً
      throw new Error('فشل في استخراج النص من ملف PDF. يرجى نسخ النص يدوياً أو استخدام ملف نصي عادي.');
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      // للملفات النصية، قراءة مباشرة
      return await file.text();
    } else if (file.type.includes('word') || file.type.includes('document')) {
      // للملفات Word، نطلب من المستخدم تحويلها إلى PDF أو نص
      throw new Error('ملفات Word غير مدعومة حالياً. يرجى تحويل الملف إلى PDF أو نص عادي.');
    } else {
      throw new Error('نوع الملف غير مدعوم. يرجى استخدام ملفات PDF أو نصوص عادية.');
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!validateDocumentFile(file)) {
      toast.error("يرجى رفع ملف PDF أو نص عادي");
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('الملف فارغ أو لا يحتوي على نص قابل للقراءة');
      }
      
      onDocumentProcessed(extractedText, file.name);
      toast.success("تم استخراج النص من الملف بنجاح!");
    } catch (error) {
      console.error("خطأ في معالجة الملف:", error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ في معالجة الملف";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Upload className="h-5 w-5" />
          رفع المستندات للتلخيص
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            يدعم التطبيق تلخيص ملفات PDF والنصوص العادية باستخدام Gemini AI مع استراتيجية الأهداف والغرض
          </AlertDescription>
        </Alert>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-purple-400 bg-purple-50' 
              : isProcessing 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && document.getElementById('document-upload')?.click()}
        >
          {isProcessing ? (
            <div className="space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
              <p className="text-purple-700 font-medium">جاري معالجة المستند...</p>
              <p className="text-purple-600 text-sm">يتم استخراج النص من الملف</p>
            </div>
          ) : (
            <div className="space-y-3">
              <FileText className="h-12 w-12 text-purple-600 mx-auto" />
              <p className="text-lg font-medium text-purple-900">
                اسحب وأفلت ملفك هنا أو اضغط للاختيار
              </p>
              <p className="text-sm text-purple-600">
                يدعم ملفات PDF والنصوص العادية
              </p>
            </div>
          )}
        </div>

        <input
          id="document-upload"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          disabled={isProcessing}
        />

        {uploadedFile && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium truncate">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p>• يستخدم التطبيق Gemini AI لتحليل وتلخيص المستندات</p>
          <p>• يدعم اللغة العربية والإنجليزية</p>
          <p>• يقوم بإنشاء ملخصات احترافية مع خرائط ذهنية</p>
          <p>• لأفضل النتائج، استخدم ملفات PDF أو نصوص واضحة</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
