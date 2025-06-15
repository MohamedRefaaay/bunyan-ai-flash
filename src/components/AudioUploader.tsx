import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, FileAudio, Loader2, Type, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
  onTranscriptGenerated: (transcript: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AudioUploader = ({ onFileUpload, onTranscriptGenerated }: AudioUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
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
      const audioBase64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke('transcribe', {
        body: { audio: audioBase64 },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.text) {
        throw new Error("لم يتمكن الذكاء الاصطناعي من تحويل الصوت.");
      }

      onTranscriptGenerated(data.text);
      toast.success("تم تحويل الصوت إلى نص بنجاح باستخدام OpenAI Whisper!");

    } catch (error) {
      console.error("خطأ في معالجة الملف:", error);
      toast.error("حدث خطأ في تحويل الصوت. يرجى المحاولة مرة أخرى أو استخدام إدخال النص المباشر.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      toast.error("يرجى إدخال نص للتحليل");
      return;
    }
    
    onTranscriptGenerated(textInput.trim());
    toast.success("تم إضافة النص بنجاح!");
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
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        handleFileSelect(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("بدأ التسجيل...");
    } catch (error) {
      console.error("خطأ في بدء التسجيل:", error);
      toast.error("تعذر الوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("تم إيقاف التسجيل وجاري المعالجة");
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
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Upload className="h-5 w-5" />
          رفع ومعالجة المحتوى
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            يدعم التطبيق الآن تحويل الصوت إلى نص باستخدام OpenAI Whisper للحصول على أفضل النتائج
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <FileAudio className="h-4 w-4" />
              ملف صوتي (Whisper AI)
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              نص مباشر
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-4 mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
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
                disabled={isProcessing || isRecording}
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
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <FileAudio className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {audioUrl && (
                    <audio controls className="w-full max-w-xs rounded-md">
                      <source src={audioUrl} type={uploadedFile.type} />
                    </audio>
                  )}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">جاري تحويل الصوت إلى نص باستخدام OpenAI Whisper...</p>
                <p className="text-blue-600 text-sm">قد يستغرق هذا بضع دقائق، يعتمد على حجم الملف</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Textarea
                placeholder="أدخل النص الذي تريد تحليله هنا..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Button
                onClick={handleTextSubmit}
                className="w-full gap-2"
                disabled={!textInput.trim()}
              >
                <Type className="h-4 w-4" />
                بدء تحليل النص
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground mt-4">
          <p>• يستخدم التطبيق OpenAI Whisper لتحويل الصوت إلى نص بدقة عالية</p>
          <p>• يدعم اللغة العربية والإنجليزية وعدة لغات أخرى</p>
          <p>• يدعم ملفات MP3, WAV, M4A, MP4, WEBM للملفات الصوتية</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploader;
