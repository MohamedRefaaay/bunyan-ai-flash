
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileAudio, Brain, Download, Sparkles } from "lucide-react";
import AudioUploader from "@/components/AudioUploader";
import FlashcardGenerator from "@/components/FlashcardGenerator";
import FlashcardPreview from "@/components/FlashcardPreview";
import { toast } from "sonner";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: "basic" | "cloze" | "mcq";
  difficulty: "easy" | "medium" | "hard";
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "preview">("upload");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    toast.success("Audio file uploaded successfully!");
  };

  const handleTranscriptGenerated = (generatedTranscript: string) => {
    setTranscript(generatedTranscript);
    setCurrentStep("processing");
  };

  const handleFlashcardsGenerated = (generatedFlashcards: Flashcard[]) => {
    setFlashcards(generatedFlashcards);
    setCurrentStep("preview");
    toast.success(`${generatedFlashcards.length} flashcards generated successfully!`);
  };

  const exportFlashcards = (format: "csv" | "json") => {
    if (flashcards.length === 0) {
      toast.error("No flashcards to export");
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "csv") {
      const headers = "Front,Back,Type,Difficulty\n";
      const rows = flashcards.map(card => 
        `"${card.front}","${card.back}","${card.type}","${card.difficulty}"`
      ).join("\n");
      content = headers + rows;
      filename = "flashcards.csv";
      mimeType = "text/csv";
    } else {
      content = JSON.stringify(flashcards, null, 2);
      filename = "flashcards.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Flashcards exported as ${format.toUpperCase()}`);
  };

  const resetApp = () => {
    setCurrentStep("upload");
    setAudioFile(null);
    setTranscript("");
    setFlashcards([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bunyan AI Flash
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your lecture recordings into intelligent Anki-ready flashcards using AI
          </p>
          <p className="text-lg text-muted-foreground mt-2" dir="rtl">
            حوّل تسجيلات محاضراتك إلى بطاقات تعليمية ذكية باستخدام الذكاء الاصطناعي
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              currentStep === "upload" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}>
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </div>
            <div className={`w-8 h-1 rounded ${
              currentStep !== "upload" ? "bg-green-500" : "bg-gray-300"
            }`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              currentStep === "processing" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              currentStep === "preview" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
              "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              <Sparkles className="h-4 w-4" />
              <span>Generate</span>
            </div>
            <div className={`w-8 h-1 rounded ${
              currentStep === "preview" ? "bg-green-500" : "bg-gray-300"
            }`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              currentStep === "preview" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              <FileAudio className="h-4 w-4" />
              <span>Preview</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === "upload" && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Upload Your Lecture Recording</CardTitle>
                <CardDescription>
                  Support for MP3, WAV, M4A, and other audio formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AudioUploader 
                  onFileUpload={handleFileUpload}
                  onTranscriptGenerated={handleTranscriptGenerated}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === "processing" && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Generate Flashcards</CardTitle>
                <CardDescription>
                  AI is analyzing your transcript and creating intelligent flashcards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlashcardGenerator 
                  transcript={transcript}
                  onFlashcardsGenerated={handleFlashcardsGenerated}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === "preview" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Your Flashcards</CardTitle>
                    <CardDescription>
                      {flashcards.length} cards generated • Ready for export
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => exportFlashcards("csv")}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button 
                      onClick={() => exportFlashcards("json")}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </Button>
                    <Button 
                      onClick={resetApp}
                      variant="secondary"
                    >
                      New Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <FlashcardPreview flashcards={flashcards} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Features Section */}
        {currentStep === "upload" && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Transcription</h3>
              <p className="text-muted-foreground">
                Advanced AI converts your audio to accurate text with speaker recognition
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Cards</h3>
              <p className="text-muted-foreground">
                Generate multiple question types: basic, cloze deletion, and multiple choice
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Anki Compatible</h3>
              <p className="text-muted-foreground">
                Export directly to CSV or JSON formats for seamless Anki import
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
