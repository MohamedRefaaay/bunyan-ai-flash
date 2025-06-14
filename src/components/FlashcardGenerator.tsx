
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

    const openAIApiKey = localStorage.getItem("openai_api_key");
    if (!openAIApiKey || openAIApiKey === "") {
        toast.error("الرجاء إدخال مفتاح OpenAI API في صفحة الإعدادات أولاً.");
        return;
    }

    setIsProcessing(true);
    
    try {
      const systemPrompt = `You are an expert in creating educational flashcards from a given text.
Your task is to generate ${cardCount} flashcards based on the provided transcript.
The flashcard type should be '${cardType}'.
The difficulty level should be '${difficulty}'.
The language of the flashcards should be Arabic.
The user has provided the following additional instructions: "${customPrompt || 'None'}".

Please provide the output as a single JSON object with a key "flashcards" which contains an array of flashcard objects.
Each flashcard object in the array must have 'front' and 'back' string properties.
Example format: {"flashcards": [{"front": "Question 1", "back": "Answer 1"}, {"front": "Question 2", "back": "Answer 2"}]}

Do not include any other text, explanations, or markdown formatting in your response. The entire response should be only the JSON object.`;
        
      const userPrompt = `Transcript:\n---\n${transcript}\n---\nPlease generate the flashcards now.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              response_format: { type: "json_object" },
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          const errorMessage = errorData?.error?.message || 'Unknown OpenAI API error';
          throw new Error(`OpenAI API Error: ${errorMessage}`);
      }

      const result = await response.json();
      const content = JSON.parse(result.choices[0].message.content);
      const generatedCards = content.flashcards;

      if (!Array.isArray(generatedCards)) {
          console.error("Unexpected AI response format:", content);
          throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء بطاقات بالتنسيق الصحيح.");
      }

      const newFlashcards: Flashcard[] = generatedCards.map((card: any, i: number) => ({
          id: `card-${Date.now()}-${i}`,
          front: card.front || " ",
          back: card.back || " ",
          type: cardType as "basic" | "cloze" | "mcq",
          difficulty: difficulty as "easy" | "medium" | "hard"
      }));

      onFlashcardsGenerated(newFlashcards);
      toast.success(`تم إنشاء ${newFlashcards.length} بطاقة تعليمية بنجاح!`);
    } catch (error) {
      console.error("خطأ في إنشاء البطاقات:", error);
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء البطاقات");
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
