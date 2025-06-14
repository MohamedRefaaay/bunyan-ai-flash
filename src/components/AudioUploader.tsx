
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Mic, FileAudio, Loader2, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
  onTranscriptGenerated: (transcript: string) => void;
}

const AudioUploader = ({ onFileUpload, onTranscriptGenerated }: AudioUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      toast.error("يرجى رفع ملف صوتي أو فيديو صالح");
      return;
    }

    setUploadedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    onFileUpload(file);
    processAudioFile(file);
  };

  const processAudioFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // محاكاة معالجة الملف الصوتي
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTranscript = `مرحباً بكم في هذه المحاضرة التعليمية الشاملة حول أساسيات التعلم الآلي.

في محاضرة اليوم، سنتناول المفاهيم الأساسية التي تشكل أساس التعلم الآلي:

1. **التعلم المُشرف عليه (Supervised Learning)**
   - التعريف والخصائص الرئيسية
   - أمثلة: الانحدار الخطي، التصنيف
   - بيانات التدريب مع أمثلة مُصنفة
   - الهدف: تعلم التطابق من المدخلات إلى المخرجات

2. **التعلم غير المُشرف عليه (Unsupervised Learning)**
   - العثور على الأنماط في البيانات غير المُصنفة
   - خوارزميات التجميع (K-means، التجميع الهرمي)
   - تقليل الأبعاد (PCA، t-SNE)
   - تعلم قواعد الترابط

3. **التعلم المُعزز (Reinforcement Learning)**
   - تفاعل الوكيل مع البيئة
   - نظام التعلم القائم على المكافآت
   - التطبيقات في الألعاب والروبوتات والأنظمة المستقلة
   - Q-learning وسياسات التدرج

4. **الخوارزميات الرئيسية**
   - أشجار القرار: سهلة التفسير، تتعامل مع البيانات الفئوية
   - الغابة العشوائية: طريقة التجميع، تقلل من فرط التدريب
   - آلات المتجهات الداعمة: فعالة للبيانات عالية الأبعاد
   - الشبكات العصبية: التعلم العميق، التعرف على الأنماط المعقدة

تذكروا أن التعلم الآلي الناجح يتطلب معالجة جيدة للبيانات وهندسة الميزات واختيار النموذج المناسب بناءً على مجال مشكلتكم المحددة.`;

      onTranscriptGenerated(mockTranscript);
      toast.success("تم تحويل الصوت إلى نص بنجاح!");
    } catch (error) {
      console.error("خطأ في معالجة الملف:", error);
      toast.error("حدث خطأ أثناء معالجة الملف الصوتي");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        handleFileSelect(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("بدأ التسجيل...");
    } catch (error) {
      console.error("خطأ في بدء التسجيل:", error);
      toast.error("تعذر الوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("تم إيقاف التسجيل");
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
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          رفع الملفات الصوتية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileAudio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">اسحب وأفلت الملف الصوتي هنا</p>
          <p className="text-muted-foreground mb-4">أو اختر ملف من جهازك</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            اختيار ملف
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "outline"}
            className="flex-1 gap-2"
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4" />
            {isRecording ? "إيقاف التسجيل" : "تسجيل صوتي"}
          </Button>
        </div>

        {uploadedFile && (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <FileAudio className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {audioUrl && (
                <audio controls className="max-w-xs">
                  <source src={audioUrl} type={uploadedFile.type} />
                </audio>
              )}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">جاري معالجة الملف الصوتي...</p>
            <p className="text-blue-600 text-sm">قد يستغرق هذا بضع دقائق</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• يدعم ملفات MP3, WAV, M4A, MP4</p>
          <p>• الحد الأقصى لحجم الملف: 100 MB</p>
          <p>• يتم تحويل الصوت إلى نص تلقائياً</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploader;
