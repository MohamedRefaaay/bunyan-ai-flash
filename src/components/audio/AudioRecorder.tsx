
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  onRecordingComplete: (file: File) => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
}

const AudioRecorder = ({
  isRecording,
  isProcessing,
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        onRecordingComplete(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingStart();
      toast.info("بدأ التسجيل...");
    } catch (error) {
      console.error("خطأ في بدء التسجيل:", error);
      toast.error("تعذر الوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStop();
      toast.success("تم إيقاف التسجيل وجاري المعالجة");
    }
  };

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      variant={isRecording ? "destructive" : "outline"}
      className="flex-1 gap-2"
      disabled={isProcessing}
    >
      <Mic className="h-4 w-4" />
      {isRecording ? "إيقاف التسجيل" : "تسجيل صوتي"}
    </Button>
  );
};

export default AudioRecorder;
