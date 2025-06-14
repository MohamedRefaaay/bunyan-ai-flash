import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import type { Flashcard } from "@/pages/Index";

interface FlashcardPreviewProps {
  flashcards: Flashcard[];
  onCardEdit?: (card: Flashcard) => void;
}

const FlashcardPreview = ({ flashcards, onCardEdit }: FlashcardPreviewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No flashcards generated yet.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setShowBack(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowBack(false);
  };

  const toggleCardFlip = () => {
    setShowBack(!showBack);
    if (!showBack) {
      setFlippedCards(prev => new Set([...prev, currentCardIndex]));
    }
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
      case "mcq": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatCardContent = (content: string, type: string) => {
    if (type === "cloze") {
      // Format cloze deletion cards
      return content.replace(/\{\{c\d+::(.*?)\}\}/g, "[...]");
    }
    return content;
  };

  return (
    <div className="space-y-6">
      {/* Card Counter and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(currentCard.difficulty)}>
              {currentCard.difficulty}
            </Badge>
            <Badge className={getTypeColor(currentCard.type)}>
              {currentCard.type.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          {onCardEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCardEdit(currentCard)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Card
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextCard}
            disabled={flashcards.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Flashcard */}
      <Card 
        className={`min-h-[300px] cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
          showBack ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950' : 
          'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        }`}
        onClick={toggleCardFlip}
      >
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            {showBack ? (
              <>
                <EyeOff className="h-5 w-5" />
                Answer
              </>
            ) : (
              <>
                <Eye className="h-5 w-5" />
                Question
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {showBack ? currentCard.back : formatCardContent(currentCard.front, currentCard.type)}
            </p>
            {!showBack && (
              <p className="text-sm text-muted-foreground mt-4">
                Click to reveal answer
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flip Button */}
      <div className="flex justify-center">
        <Button
          onClick={toggleCardFlip}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {showBack ? "Show Question" : "Show Answer"}
        </Button>
      </div>

      {/* Card Grid Overview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">All Cards Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card, index) => (
            <Card
              key={card.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                index === currentCardIndex ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => {
                setCurrentCardIndex(index);
                setShowBack(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">Card {index + 1}</span>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {card.type}
                    </Badge>
                    {onCardEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardEdit(card);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {formatCardContent(card.front, card.type)}
                </p>
                {flippedCards.has(index) && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Answer: {card.back}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardPreview;
