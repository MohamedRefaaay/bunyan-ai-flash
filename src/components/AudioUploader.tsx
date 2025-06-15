import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileAudio, Type, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AudioFileUpload from "./audio/AudioFileUpload";
import AudioRecorder from "./audio/AudioRecorder";
import TextInput from "./audio/TextInput";
import FilePreview from "./audio/FilePreview";
import ProcessingStatus from "./audio/ProcessingStatus";
import { fileToBase64, validateAudioFile } from "@/utils/audioUtils";
import { getAIProviderConfig } from "@/utils/aiProviders";

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

  const handleFileSelect = (file: File) => {
    if (!validateAudioFile(file)) {
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
      const config = getAIProviderConfig();

      if (!config || config.provider !== 'gemini' || !localStorage.getItem('gemini_api_key')) {
        toast.error("لتحويل الصوت، يرجى اختيار وتكوين Gemini في الإعدادات.", {
          description: "هذه الميزة تستخدم Gemini للحصول على أفضل دقة.",
          action: {
            label: "إلى الإعدادات",
            onClick: () => window.location.href = "/settings"
          }
        });
        setIsProcessing(false);
        return;
      }
      
      const audioBase64 = await fileToBase64(file);
      const audioData = audioBase64.split(',')[1];
      
      const { data, error } = await supabase.functions.invoke('transcribe-with-gemini', {
          body: { audio: audioData, mimeType: file.type },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      if (!data.text) throw new Error("لم يتمكن Gemini من تحويل الصوت.");
      
      const transcriptText = data.text;
      toast.success("تم تحويل الصوت إلى نص بنجاح باستخدام Gemini!");

      onTranscriptGenerated(transcriptText);

    } catch (error) {
      console.error("خطأ في معالجة الملف:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ في تحويل الصوت. يرجى المحاولة مرة أخرى أو استخدام إدخال النص المباشر.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (text: string) => {
    onTranscriptGenerated(text);
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

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  const handleRecordingComplete = (file: File) => {
    handleFileSelect(file);
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
            يدعم التطبيق الآن تحويل الصوت إلى نص باستخدام Google Gemini للحصول على أفضل النتائج.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <FileAudio className="h-4 w-4" />
              ملف صوتي (Gemini AI)
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              نص مباشر
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="space-y-4 mt-4">
            <AudioFileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
              isRecording={isRecording}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />

            <div className="flex gap-2">
              <AudioRecorder
                isRecording={isRecording}
                isProcessing={isProcessing}
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
              />
            </div>

            {uploadedFile && audioUrl && (
              <FilePreview file={uploadedFile} audioUrl={audioUrl} />
            )}

            {isProcessing && <ProcessingStatus />}
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <TextInput onTextSubmit={handleTextSubmit} />
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground mt-4">
          <p>• يستخدم التطبيق Google Gemini لتحويل الصوت إلى نص بدقة عالية</p>
          <p>• يدعم اللغة العربية والإنجليزية وعدة لغات أخرى</p>
          <p>• يدعم ملفات MP3, WAV, M4A, MP4, WEBM للملفات الصوتية</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploader;
