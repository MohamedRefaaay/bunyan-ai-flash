
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileAudio, Brain, Download, Sparkles, BarChart3, Youtube, Wand2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AudioUploader from "@/components/AudioUploader";
import FlashcardGenerator from "@/components/FlashcardGenerator";
import FlashcardPreview from "@/components/FlashcardPreview";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import YouTubeIntegration from "@/components/YouTubeIntegration";
import AICardEditor from "@/components/AICardEditor";
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    toast.success("تم رفع الملف الصوتي بنجاح!");
  };

  const handleTranscriptGenerated = (generatedTranscript: string, title?: string) => {
    setTranscript(generatedTranscript);
    setCurrentStep("processing");
    if (title) {
      toast.success(`تم إنشاء النسخة النصية من: ${title}`);
    }
  };

  const handleFlashcardsGenerated = (generatedFlashcards: Flashcard[]) => {
    setFlashcards(generatedFlashcards);
    setCurrentStep("preview");
    toast.success(`تم إنشاء ${generatedFlashcards.length} بطاقة تعليمية بنجاح!`);
  };

  const handleCardUpdate = (updatedCard: Flashcard) => {
    setFlashcards(prevCards => 
      prevCards.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
  };

  const exportFlashcards = (format: "csv" | "json") => {
    if (flashcards.length === 0) {
      toast.error("لا توجد بطاقات للتصدير");
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
    
    toast.success(`تم تصدير البطاقات بصيغة ${format.toUpperCase()}`);
  };

  const resetApp = () => {
    setCurrentStep("upload");
    setAudioFile(null);
    setTranscript("");
    setFlashcards([]);
    setIsProcessing(false);
  };

  const SidebarContent = () => (
    <div className="p-4 space-y-4">
      <Button 
        variant="outline" 
        onClick={() => {
          setShowAnalytics(true);
          setSidebarOpen(false);
        }}
        className="w-full gap-2"
      >
        <BarChart3 className="h-4 w-4" />
        التحليلات
      </Button>
      <Button 
        variant="outline" 
        onClick={() => setSidebarOpen(false)}
        className="w-full gap-2"
      >
        <Upload className="h-4 w-4" />
        جلسة جديدة
      </Button>
      {flashcards.length > 0 && (
        <>
          <Button 
            onClick={() => {
              exportFlashcards("csv");
              setSidebarOpen(false);
            }}
            variant="outline"
            className="w-full gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير CSV
          </Button>
          <Button 
            onClick={() => {
              exportFlashcards("json");
              setSidebarOpen(false);
            }}
            variant="outline"
            className="w-full gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير JSON
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Mobile Header with Sidebar */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bunyan AI Flash
            </h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="text-center mb-8 sm:mb-12 hidden sm:block">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bunyan AI Flash
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Transform your lecture recordings into intelligent Anki-ready flashcards using AI
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 px-4" dir="rtl">
            حوّل تسجيلات محاضراتك إلى بطاقات تعليمية ذكية باستخدام الذكاء الاصطناعي
          </p>
          
          {/* Desktop Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(true)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Mobile Header Description */}
        <div className="text-center mb-6 sm:hidden px-2">
          <p className="text-sm text-muted-foreground" dir="rtl">
            حوّل تسجيلات محاضراتك إلى بطاقات تعليمية ذكية
          </p>
        </div>

        {/* Progress Indicator - Responsive */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="flex items-center gap-2 sm:gap-4 w-full max-w-2xl">
            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${
              currentStep === "upload" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            }`}>
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upload</span>
              <span className="sm:hidden">رفع</span>
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep !== "upload" ? "bg-green-500" : "bg-gray-300"
            }`} />
            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${
              currentStep === "processing" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              currentStep === "preview" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
              "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Generate</span>
              <span className="sm:hidden">إنشاء</span>
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep === "preview" ? "bg-green-500" : "bg-gray-300"
            }`} />
            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${
              currentStep === "preview" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
              "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              <FileAudio className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Preview</span>
              <span className="sm:hidden">معاينة</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          {currentStep === "upload" && (
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center px-4 sm:px-6">
                  <CardTitle className="text-xl sm:text-2xl">Upload Your Lecture Recording</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Support for MP3, WAV, M4A, and other audio formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <AudioUploader 
                    onFileUpload={handleFileUpload}
                    onTranscriptGenerated={handleTranscriptGenerated}
                  />
                </CardContent>
              </Card>

              {/* YouTube Integration */}
              <YouTubeIntegration onTranscriptGenerated={handleTranscriptGenerated} />
            </div>
          )}

          {currentStep === "processing" && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl">Generate Flashcards</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  AI is analyzing your transcript and creating intelligent flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
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
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Your Flashcards</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {flashcards.length} cards generated • Ready for export
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={() => exportFlashcards("csv")}
                        variant="outline"
                        className="gap-2 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        Export CSV
                      </Button>
                      <Button 
                        onClick={() => exportFlashcards("json")}
                        variant="outline"
                        className="gap-2 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        Export JSON
                      </Button>
                      <Button 
                        onClick={resetApp}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                        size="sm"
                      >
                        New Session
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <FlashcardPreview 
                    flashcards={flashcards} 
                    onCardEdit={setEditingCard}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Features Section - Responsive Grid */}
        {currentStep === "upload" && (
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Smart Transcription</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI converts your audio to accurate text with speaker recognition
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">AI-Powered Cards</h3>
              <p className="text-sm text-muted-foreground">
                Generate multiple question types: basic, cloze deletion, and multiple choice
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Anki Compatible</h3>
              <p className="text-sm text-muted-foreground">
                Export directly to CSV or JSON formats for seamless Anki import
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Dashboard Modal */}
      <AnalyticsDashboard 
        isVisible={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />

      {/* AI Card Editor Modal */}
      {editingCard && (
        <AICardEditor
          card={editingCard}
          onCardUpdate={handleCardUpdate}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
};

export default Index;
