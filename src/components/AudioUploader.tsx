
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
  onTranscriptGenerated: (transcript: string) => void;
}

const AudioUploader = ({ onFileUpload, onTranscriptGenerated }: AudioUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error("Please upload an audio file (MP3, WAV, M4A, etc.)");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setUploadedFile(file);
    onFileUpload(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startTranscription = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an audio file first");
      return;
    }

    setIsTranscribing(true);
    
    try {
      // Simulate transcription process
      // In a real app, this would call an actual transcription API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTranscript = `Welcome to today's lecture on artificial intelligence and machine learning. 

In this session, we'll explore the fundamental concepts of AI, including supervised learning, unsupervised learning, and reinforcement learning. 

Supervised learning involves training models on labeled data, where we know the correct answers. Examples include image classification and sentiment analysis.

Unsupervised learning deals with finding patterns in data without labels. Clustering and dimensionality reduction are common techniques.

Reinforcement learning involves agents learning through trial and error, receiving rewards for good actions. This is used in game playing and robotics.

Key algorithms we'll discuss include:
- Linear regression for prediction
- Decision trees for classification
- Neural networks for complex pattern recognition
- K-means for clustering
- Q-learning for reinforcement learning

The applications of these techniques are vast, including healthcare, finance, autonomous vehicles, and natural language processing.`;

      onTranscriptGenerated(mockTranscript);
      toast.success("Transcription completed successfully!");
      
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive
              ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
              : "border-gray-300 hover:border-purple-400 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Upload className="h-16 w-16 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Drop your audio file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports MP3, WAV, M4A, and other audio formats (max 100MB)
              </p>
              <Button variant="outline">
                Select Audio File
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button
                onClick={startTranscription}
                disabled={isTranscribing}
                className="gap-2"
                size="lg"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  "Start Transcription"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default AudioUploader;
