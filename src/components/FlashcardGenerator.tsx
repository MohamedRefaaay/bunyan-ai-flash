
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Sparkles, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Flashcard } from "@/types/flashcard";

interface FlashcardGeneratorProps {
  transcript: string;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const FlashcardGenerator = ({ 
  transcript, 
  onFlashcardsGenerated, 
  isProcessing, 
  setIsProcessing 
}: FlashcardGeneratorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [cardType, setCardType] = useState("basic");
  const [difficulty, setDifficulty] = useState("medium");
  const [cardCount, setCardCount] = useState("10");

  const generateFlashcards = async () => {
    if (!transcript || transcript.length === 0) {
      toast.error("الرجاء رفع محتوى أولاً لإنشاء البطاقات");
      return;
    }

    setIsProcessing(true);
    
    try {
      // محاكاة معالجة الذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const count = parseInt(cardCount);
      const mockFlashcards: Flashcard[] = Array.from({ length: count }, (_, i) => ({
        id: `card-${Date.now()}-${i}`,
        front: `سؤال ${i + 1}: ما هو المفهوم الأساسي رقم ${i + 1} في المحاضرة؟`,
        back: `الإجابة ${i + 1}: تفسير مفصل للمفهوم الأساسي رقم ${i + 1} كما ورد في النص المُحلل.`,
        type: cardType as "basic" | "cloze" | "mcq",
        difficulty: difficulty as "easy" | "medium" | "hard"
      }));

      onFlashcardsGenerated(mockFlashcards);
      toast.success(`تم إنشاء ${count} بطاقة تعليمية بنجاح!`);
    } catch (error) {
      console.error("خطأ في إنشاء البطاقات:", error);
      toast.error("حدث خطأ أثناء إنشاء البطاقات");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          مولد البطاقات الذكي
          <Badge variant="secondary">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transcript && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-2">المحتوى المُحلل:</p>
            <p className="text-sm line-clamp-3">{transcript.substring(0, 200)}...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">نوع البطاقة</label>
            <Select value={cardType} onValueChange={setCardType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">أساسية</SelectItem>
                <SelectItem value="cloze">ملء الفراغات</SelectItem>
                <SelectItem value="mcq">اختيار متعدد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">مستوى الصعوبة</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">سهل</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="hard">صعب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">عدد البطاقات</label>
            <Select value={cardCount} onValueChange={setCardCount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 بطاقات</SelectItem>
                <SelectItem value="10">10 بطاقات</SelectItem>
                <SelectItem value="15">15 بطاقة</SelectItem>
                <SelectItem value="20">20 بطاقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">تعليمات إضافية (اختياري)</label>
          <Textarea
            placeholder="أضف تعليمات محددة لتخصيص البطاقات..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={generateFlashcards}
          disabled={isProcessing || !transcript}
          className="w-full gap-2"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري إنشاء البطاقات...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              إنشاء البطاقات التعليمية
            </>
          )}
        </Button>

        {!transcript && (
          <div className="text-center py-4">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">ارفع ملف صوتي أو استورد من يوتيوب لبدء إنشاء البطاقات</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardGenerator;
