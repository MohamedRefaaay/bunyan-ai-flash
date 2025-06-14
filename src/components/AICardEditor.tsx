
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Wand2, CheckCircle, XCircle, Lightbulb, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Flashcard } from "@/types/flashcard";

interface AISuggestion {
  id: string;
  type: "improve" | "rephrase" | "difficulty";
  title: string;
  description: string;
  newFront?: string;
  newBack?: string;
  newDifficulty?: string;
}

interface AICardEditorProps {
  card: Flashcard;
  onCardUpdate: (card: Flashcard) => void;
  onClose: () => void;
}

const AICardEditor = ({ card, onCardUpdate, onClose }: AICardEditorProps) => {
  if (!card) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
          <p>لم يتم اختيار بطاقة للتحرير.</p>
          <Button onClick={onClose}>إغلاق</Button>
        </div>
      </div>
    );
  }

  const [editedCard, setEditedCard] = useState<Flashcard>(card);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true);
    
    // محاكاة توليد اقتراحات الذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions: AISuggestion[] = [
      {
        id: "suggest-1",
        type: "improve",
        title: "تحسين الوضوح",
        description: "جعل السؤال أكثر وضوحاً ومباشرة",
        newFront: "ما هو التعريف الدقيق للمفهوم الأساسي؟",
        newBack: "إجابة محسنة ومفصلة أكثر مع أمثلة توضيحية."
      },
      {
        id: "suggest-2",
        type: "rephrase",
        title: "إعادة صياغة",
        description: "صياغة أفضل باللغة العربية",
        newFront: "اشرح المفهوم الأساسي بطريقة مبسطة",
        newBack: "شرح مبسط ومفهوم للمفهوم مع استخدام كلمات واضحة."
      },
      {
        id: "suggest-3",
        type: "difficulty",
        title: "تعديل مستوى الصعوبة",
        description: "جعل البطاقة أكثر تحدياً",
        newDifficulty: "hard"
      }
    ];
    
    setAiSuggestions(suggestions);
    setIsGeneratingSuggestions(false);
    toast.success("تم توليد الاقتراحات الذكية!");
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    const updatedCard = { ...editedCard };
    
    if (suggestion.newFront) updatedCard.front = suggestion.newFront;
    if (suggestion.newBack) updatedCard.back = suggestion.newBack;
    if (suggestion.newDifficulty) updatedCard.difficulty = suggestion.newDifficulty as "easy" | "medium" | "hard";
    
    setEditedCard(updatedCard);
    toast.success("تم تطبيق الاقتراح!");
  };

  const saveCard = () => {
    onCardUpdate(editedCard);
    toast.success("تم حفظ البطاقة بنجاح!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-5 w-5" />
              محرر البطاقات الذكي
            </h2>
            <div className="flex gap-2">
              <Button onClick={saveCard} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={onClose}>
                <XCircle className="h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* تحرير البطاقة */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحرير البطاقة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">السؤال (الوجه الأمامي)</label>
                  <Textarea
                    value={editedCard.front || ""}
                    onChange={(e) => setEditedCard({...editedCard, front: e.target.value})}
                    className="min-h-[120px]"
                    placeholder="أدخل سؤالك هنا..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الإجابة (الوجه الخلفي)</label>
                  <Textarea
                    value={editedCard.back || ""}
                    onChange={(e) => setEditedCard({...editedCard, back: e.target.value})}
                    className="min-h-[120px]"
                    placeholder="أدخل إجابتك هنا..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">النوع</label>
                    <Select 
                      value={editedCard.type} 
                      onValueChange={(value) => setEditedCard({...editedCard, type: value as "basic" | "cloze" | "mcq"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">أساسي</SelectItem>
                        <SelectItem value="cloze">ملء الفراغات</SelectItem>
                        <SelectItem value="mcq">اختيار متعدد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">الصعوبة</label>
                    <Select 
                      value={editedCard.difficulty} 
                      onValueChange={(value) => setEditedCard({...editedCard, difficulty: value as "easy" | "medium" | "hard"})}
                    >
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الاقتراحات الذكية */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    الاقتراحات الذكية
                  </CardTitle>
                  <Button 
                    onClick={generateAISuggestions}
                    disabled={isGeneratingSuggestions}
                    size="sm"
                    className="gap-2"
                  >
                    {isGeneratingSuggestions ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                    توليد اقتراحات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {aiSuggestions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>اضغط على "توليد اقتراحات" للحصول على تحسينات ذكية</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(suggestion)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            تطبيق
                          </Button>
                        </div>
                        {suggestion.newFront && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <strong>سؤال جديد:</strong> {suggestion.newFront}
                          </div>
                        )}
                        {suggestion.newBack && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>إجابة جديدة:</strong> {suggestion.newBack}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICardEditor;
