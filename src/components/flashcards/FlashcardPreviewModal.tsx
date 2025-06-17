
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, Eye } from 'lucide-react';
import type { Flashcard } from '@/types/flashcard';

interface FlashcardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  onExport: () => void;
  onEdit: (card: Flashcard) => void;
}

const FlashcardPreviewModal: React.FC<FlashcardPreviewModalProps> = ({
  isOpen,
  onClose,
  flashcards,
  onExport,
  onEdit
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            معاينة البطاقات التعليمية ({flashcards.length} بطاقة)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              تصدير للأنكي
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {flashcards.map((card, index) => (
              <Card key={card.id || index} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className={getDifficultyColor(card.difficulty)}>
                      {card.difficulty === 'easy' ? 'سهل' : 
                       card.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(card)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      تعديل
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-purple-900 mb-1">الوجه الأمامي:</h4>
                      <p className="text-sm bg-purple-50 p-2 rounded">{card.front}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">الوجه الخلفي:</h4>
                      <p className="text-sm bg-blue-50 p-2 rounded">{card.back}</p>
                    </div>
                    
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {card.signature && (
                      <p className="text-xs text-gray-500 italic">{card.signature}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardPreviewModal;
