
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Flashcard } from "@/pages/Index";

interface FlashcardPreviewProps {
  flashcards: Flashcard[];
  onCardEdit: (card: Flashcard) => void;
}

const FlashcardPreview = ({ flashcards, onCardEdit }: FlashcardPreviewProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  
  const totalPages = Math.ceil(flashcards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = flashcards.slice(startIndex, endIndex);

  const toggleFlip = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "basic": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cloze": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "mcq": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-muted-foreground text-sm sm:text-base">No flashcards generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {currentCards.map((card) => {
          const isFlipped = flippedCards.has(card.id);
          return (
            <Card 
              key={card.id} 
              className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer min-h-[200px] sm:min-h-[240px]"
              onClick={() => toggleFlip(card.id)}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Badge className={`text-xs ${getDifficultyColor(card.difficulty)}`}>
                      {card.difficulty}
                    </Badge>
                    <Badge className={`text-xs ${getTypeColor(card.type)}`}>
                      {card.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardEdit(card);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
                  {!isFlipped ? (
                    <div>
                      <CardTitle className="text-sm sm:text-base mb-2 sm:mb-3 line-clamp-4">
                        {card.front}
                      </CardTitle>
                      <div className="flex items-center justify-center mt-4">
                        <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Show Answer</span>
                          <span className="sm:hidden">إظهار</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground mb-2">
                        Answer:
                      </CardDescription>
                      <p className="text-sm sm:text-base line-clamp-5">{card.back}</p>
                      <div className="flex items-center justify-center mt-4">
                        <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Show Question</span>
                          <span className="sm:hidden">إخفاء</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination - Mobile Friendly */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, flashcards.length)} of {flashcards.length} cards
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons - Mobile Stack */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => setFlippedCards(new Set())}
          className="w-full sm:w-auto gap-2 text-xs sm:text-sm"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          Reset All Cards
        </Button>
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Click cards to flip • {flippedCards.size} of {flashcards.length} cards viewed
        </div>
      </div>
    </div>
  );
};

export default FlashcardPreview;
