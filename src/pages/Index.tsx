
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileAudio, Brain, Download, Sparkles, BarChart3, Youtube, Wand2, Menu, Image, Users, Cloud, Palette, Languages } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AudioUploader from "@/components/AudioUploader";
import FlashcardGenerator from "@/components/FlashcardGenerator";
import FlashcardPreview from "@/components/FlashcardPreview";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import YouTubeIntegration from "@/components/YouTubeIntegration";
import AICardEditor from "@/components/AICardEditor";
import VisualFlashcardGenerator from "@/components/VisualFlashcardGenerator";
import SmartRecommendationEngine from "@/components/SmartRecommendationEngine";
import FlashcardPersonalization from "@/components/FlashcardPersonalization";
import CloudIntegration from "@/components/CloudIntegration";
import CommunityModule from "@/components/CommunityModule";
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
  const [activeTab, setActiveTab] = useState("main");
  const [isArabic, setIsArabic] = useState(true);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    toast.success(isArabic ? "تم رفع الملف الصوتي بنجاح!" : "Audio file uploaded successfully!");
  };

  const handleTranscriptGenerated = (generatedTranscript: string, title?: string) => {
    setTranscript(generatedTranscript);
    setCurrentStep("processing");
    if (title) {
      toast.success(isArabic ? `تم إنشاء النسخة النصية من: ${title}` : `Transcript generated from: ${title}`);
    }
  };

  const handleFlashcardsGenerated = (generatedFlashcards: Flashcard[]) => {
    setFlashcards(generatedFlashcards);
    setCurrentStep("preview");
    toast.success(isArabic ? `تم إنشاء ${generatedFlashcards.length} بطاقة تعليمية بنجاح!` : `Generated ${generatedFlashcards.length} flashcards successfully!`);
  };

  const handleCardUpdate = (updatedCard: Flashcard) => {
    setFlashcards(prevCards => 
      prevCards.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
  };

  const exportFlashcards = (format: "csv" | "json") => {
    if (flashcards.length === 0) {
      toast.error(isArabic ? "لا توجد بطاقات للتصدير" : "No cards to export");
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
    
    toast.success(isArabic ? `تم تصدير البطاقات بصيغة ${format.toUpperCase()}` : `Cards exported as ${format.toUpperCase()}`);
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
        {isArabic ? "التحليلات" : "Analytics"}
      </Button>
      <Button 
        variant="outline" 
        onClick={() => {
          setActiveTab("visual");
          setSidebarOpen(false);
        }}
        className="w-full gap-2"
      >
        <Image className="h-4 w-4" />
        {isArabic ? "البطاقات البصرية" : "Visual Cards"}
      </Button>
      <Button 
        variant="outline" 
        onClick={() => {
          setActiveTab("community");
          setSidebarOpen(false);
        }}
        className="w-full gap-2"
      >
        <Users className="h-4 w-4" />
        {isArabic ? "المجتمع" : "Community"}
      </Button>
      <Button 
        variant="outline" 
        onClick={() => setSidebarOpen(false)}
        className="w-full gap-2"
      >
        <Upload className="h-4 w-4" />
        {isArabic ? "جلسة جديدة" : "New Session"}
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
            {isArabic ? "تصدير CSV" : "Export CSV"}
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
            {isArabic ? "تصدير JSON" : "Export JSON"}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Languages className="h-4 w-4" />
            <Label htmlFor="language-toggle" className="text-xs">
              {isArabic ? "English" : "العربية"}
            </Label>
            <Switch
              id="language-toggle"
              checked={isArabic}
              onCheckedChange={setIsArabic}
            />
          </div>
        </div>

        {/* Mobile Header with Sidebar */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isArabic ? "left" : "right"} className="w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {isArabic ? "بنيان الذكي" : "Bunyan AI Flash"}
            </h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="text-center mb-8 sm:mb-12 hidden sm:block">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {isArabic ? "بنيان الذكي للبطاقات التعليمية" : "Bunyan AI Flash"}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {isArabic 
              ? "حوّل تسجيلات محاضراتك إلى بطاقات تعليمية ذكية متوافقة مع أنكي باستخدام الذكاء الاصطناعي"
              : "Transform your lecture recordings into intelligent Anki-ready flashcards using AI"
            }
          </p>
        </div>

        {/* Mobile Header Description */}
        <div className="text-center mb-6 sm:hidden px-2">
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? "حوّل تسجيلات محاضراتك إلى بطاقات تعليمية ذكية"
              : "Transform recordings into smart flashcards"
            }
          </p>
        </div>

        {/* Advanced Features Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 h-auto">
              <TabsTrigger value="main" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isArabic ? "الرئيسية" : "Main"}</span>
                <span className="sm:hidden">{isArabic ? "رئيسي" : "Main"}</span>
              </TabsTrigger>
              <TabsTrigger value="visual" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2">
                <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isArabic ? "البصرية" : "Visual"}</span>
                <span className="sm:hidden">{isArabic ? "بصري" : "Visual"}</span>
              </TabsTrigger>
              <TabsTrigger value="personalize" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2">
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isArabic ? "التخصيص" : "Styles"}</span>
                <span className="sm:hidden">{isArabic ? "تصميم" : "Style"}</span>
              </TabsTrigger>
              <TabsTrigger value="cloud" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2">
                <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isArabic ? "السحابة" : "Cloud"}</span>
                <span className="sm:hidden">{isArabic ? "سحابة" : "Cloud"}</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isArabic ? "المجتمع" : "Community"}</span>
                <span className="sm:hidden">{isArabic ? "مجتمع" : "Community"}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="main">
              {/* Progress Indicator - Responsive */}
              <div className="flex justify-center mb-6 sm:mb-8 px-2">
                <div className="flex items-center gap-2 sm:gap-4 w-full max-w-2xl">
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${
                    currentStep === "upload" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
                    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}>
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{isArabic ? "الرفع" : "Upload"}</span>
                    <span className="sm:hidden">{isArabic ? "رفع" : "Upload"}</span>
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
                    <span className="hidden sm:inline">{isArabic ? "الإنشاء" : "Generate"}</span>
                    <span className="sm:hidden">{isArabic ? "إنشاء" : "Generate"}</span>
                  </div>
                  <div className={`flex-1 h-1 rounded ${
                    currentStep === "preview" ? "bg-green-500" : "bg-gray-300"
                  }`} />
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm ${
                    currentStep === "preview" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : 
                    "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}>
                    <FileAudio className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{isArabic ? "المعاينة" : "Preview"}</span>
                    <span className="sm:hidden">{isArabic ? "معاينة" : "Preview"}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-4xl mx-auto px-2 sm:px-0">
                {currentStep === "upload" && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-xl">
                      <CardHeader className="text-center px-4 sm:px-6">
                        <CardTitle className="text-xl sm:text-2xl">
                          {isArabic ? "ارفع تسجيل محاضرتك" : "Upload Your Lecture Recording"}
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                          {isArabic 
                            ? "يدعم ملفات MP3، WAV، M4A وصيغ صوتية أخرى"
                            : "Support for MP3, WAV, M4A, and other audio formats"
                          }
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
                  <div className="space-y-6">
                    <Card className="border-0 shadow-xl">
                      <CardHeader className="text-center px-4 sm:px-6">
                        <CardTitle className="text-xl sm:text-2xl">
                          {isArabic ? "إنشاء البطاقات التعليمية" : "Generate Flashcards"}
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                          {isArabic 
                            ? "الذكاء الاصطناعي يحلل النص وينشئ بطاقات تعليمية ذكية"
                            : "AI is analyzing your transcript and creating intelligent flashcards"
                          }
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

                    {/* Smart Recommendations */}
                    <SmartRecommendationEngine 
                      transcript={transcript}
                      onRecommendationsApply={handleFlashcardsGenerated}
                    />
                  </div>
                )}

                {currentStep === "preview" && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-xl">
                      <CardHeader className="px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl sm:text-2xl">
                              {isArabic ? "بطاقاتك التعليمية" : "Your Flashcards"}
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                              {isArabic 
                                ? `تم إنشاء ${flashcards.length} بطاقة • جاهزة للتصدير`
                                : `${flashcards.length} cards generated • Ready for export`
                              }
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
                              {isArabic ? "تصدير CSV" : "Export CSV"}
                            </Button>
                            <Button 
                              onClick={() => exportFlashcards("json")}
                              variant="outline"
                              className="gap-2 text-xs sm:text-sm"
                              size="sm"
                            >
                              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                              {isArabic ? "تصدير JSON" : "Export JSON"}
                            </Button>
                            <Button 
                              onClick={resetApp}
                              variant="secondary"
                              className="text-xs sm:text-sm"
                              size="sm"
                            >
                              {isArabic ? "جلسة جديدة" : "New Session"}
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
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
              <VisualFlashcardGenerator 
                transcript={transcript} 
                onVisualCardsGenerated={handleFlashcardsGenerated}
              />
            </TabsContent>

            <TabsContent value="personalize" className="space-y-6">
              <FlashcardPersonalization onStyleChange={(style) => console.log('Style changed:', style)} />
            </TabsContent>

            <TabsContent value="cloud" className="space-y-6">
              <CloudIntegration />
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <CommunityModule />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section - Responsive Grid */}
        {currentStep === "upload" && activeTab === "main" && (
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {isArabic ? "النسخ الذكي" : "Smart Transcription"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "ذكاء اصطناعي متقدم يحول الصوت إلى نص دقيق مع تمييز المتحدثين"
                  : "Advanced AI converts your audio to accurate text with speaker recognition"
                }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {isArabic ? "بطاقات ذكية" : "AI-Powered Cards"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "إنشاء أنواع متعددة من الأسئلة: بسيطة، حذف الكلمات، واختيار متعدد"
                  : "Generate multiple question types: basic, cloze deletion, and multiple choice"
                }
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {isArabic ? "متوافق مع أنكي" : "Anki Compatible"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "تصدير مباشر بصيغة CSV أو JSON للاستيراد السلس في أنكي"
                  : "Export directly to CSV or JSON formats for seamless Anki import"
                }
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
