
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, BarChart3, Network, Table, Search } from 'lucide-react';
import { toast } from 'sonner';
import { searchPexelsImages, makeAIRequest } from '@/utils/aiProviders';

interface VisualFlashcardGeneratorProps {
  transcript: string;
  onVisualCardsGenerated: (cards: any[]) => void;
}

const VisualFlashcardGenerator = ({ transcript, onVisualCardsGenerated }: VisualFlashcardGeneratorProps) => {
  const [visualType, setVisualType] = useState<string>('diagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);

  const generateVisualCards = async () => {
    if (!transcript) {
      toast.error("يرجى رفع ومعالجة المحتوى أولاً");
      return;
    }

    setIsGenerating(true);
    
    try {
      // توليد البطاقات باستخدام Gemini
      const prompt = `قم بتحليل النص التالي وإنشاء 5 بطاقات تعليمية مرئية من نوع ${visualType}:

النص: ${transcript}

يرجى إرجاع البيانات بصيغة JSON مع الهيكل التالي:
{
  "cards": [
    {
      "id": "visual-1",
      "front": "عنوان البطاقة",
      "back": "محتوى البطاقة",
      "type": "basic",
      "difficulty": "medium",
      "visual": true,
      "searchKeyword": "كلمة مفتاحية للبحث عن صورة مناسبة"
    }
  ]
}`;

      const systemPrompt = 'أنت خبير في إنشاء البطاقات التعليمية المرئية. أرجع استجابة JSON صالحة فقط.';
      
      const response = await makeAIRequest(prompt, { systemPrompt });
      const data = JSON.parse(response);
      
      // البحث عن صور من Pexels لكل بطاقة
      const cardsWithImages = await Promise.all(
        data.cards.map(async (card: any) => {
          try {
            const images = await searchPexelsImages(card.searchKeyword || card.front, 1);
            return {
              ...card,
              imageUrl: images && images.length > 0 ? images[0].src.medium : null
            };
          } catch (error) {
            console.log('لا يمكن البحث عن صور، سيتم استخدام البطاقة بدون صورة');
            return card;
          }
        })
      );
      
      setGeneratedCards(cardsWithImages);
      onVisualCardsGenerated(cardsWithImages);
      toast.success(`تم إنشاء ${cardsWithImages.length} بطاقة مرئية بنجاح!`);
      
    } catch (error) {
      console.error('خطأ في توليد البطاقات المرئية:', error);
      toast.error('حدث خطأ في توليد البطاقات المرئية');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          مولد البطاقات المرئية - مدعوم بـ Gemini و Pexels
          {generatedCards.length > 0 && (
            <Badge variant="secondary">{generatedCards.length} بطاقة</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant={visualType === 'diagram' ? 'default' : 'outline'}
            onClick={() => setVisualType('diagram')}
            className="gap-2"
            size="sm"
          >
            <BarChart3 className="h-4 w-4" />
            مخططات
          </Button>
          <Button
            variant={visualType === 'table' ? 'default' : 'outline'}
            onClick={() => setVisualType('table')}
            className="gap-2"
            size="sm"
          >
            <Table className="h-4 w-4" />
            جداول
          </Button>
          <Button
            variant={visualType === 'mindmap' ? 'default' : 'outline'}
            onClick={() => setVisualType('mindmap')}
            className="gap-2"
            size="sm"
          >
            <Network className="h-4 w-4" />
            خرائط ذهنية
          </Button>
          <Button
            variant={visualType === 'concept' ? 'default' : 'outline'}
            onClick={() => setVisualType('concept')}
            className="gap-2"
            size="sm"
          >
            <Image className="h-4 w-4" />
            مفاهيم
          </Button>
        </div>
        
        <Button 
          onClick={generateVisualCards}
          disabled={isGenerating || !transcript}
          className="w-full"
        >
          {isGenerating ? 'جاري إنشاء البطاقات المرئية...' : 'إنشاء البطاقات المرئية'}
        </Button>

        {generatedCards.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-3">معاينة البطاقات المرئية المولدة</h4>
            <div className="space-y-3">
              {generatedCards.map((card, index) => (
                <div key={card.id} className="flex items-center gap-3 text-sm border rounded-lg p-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  {card.imageUrl && (
                    <img 
                      src={card.imageUrl} 
                      alt={card.front}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{card.front}</p>
                    <p className="text-muted-foreground text-xs">{card.back}</p>
                  </div>
                  <Badge variant="secondary">{card.difficulty}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• يستخدم Google Gemini لتوليد البطاقات التعليمية</p>
          <p>• يستخدم Pexels للبحث عن الصور المناسبة</p>
          <p>• يدعم أنواع مختلفة من البطاقات المرئية</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualFlashcardGenerator;
