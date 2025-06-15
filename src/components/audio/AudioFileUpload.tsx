
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio } from "lucide-react";

interface AudioFileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  isRecording: boolean;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const AudioFileUpload = ({
  onFileSelect,
  isProcessing,
  isRecording,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: AudioFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default AudioFileUpload;
