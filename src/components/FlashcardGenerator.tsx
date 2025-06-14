
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles, Edit3 } from "lucide-react";
import { toast } from "sonner";
import type { Flashcard } from "@/pages/Index";

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
  const [editedTranscript, setEditedTranscript] = useState(transcript);
  const [cardType, setCardType] = useState<"mixed" | "basic" | "cloze" | "mcq">("mixed");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [cardCount, setCardCount] = useState([10]);

  const generateFlashcards = async () => {
    if (!editedTranscript.trim()) {
      toast.error("Please provide a transcript to generate flashcards");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Generate mock flashcards based on the transcript
      const mockFlashcards: Flashcard[] = [
        {
          id: "1",
          front: "What are the three main types of machine learning?",
          back: "Supervised learning, unsupervised learning, and reinforcement learning",
          type: "basic",
          difficulty: "easy"
        },
        {
          id: "2",
          front: "Supervised learning involves training models on {{c1::labeled data}} where we know the {{c2::correct answers}}.",
          back: "labeled data, correct answers",
          type: "cloze",
          difficulty: "medium"
        },
        {
          id: "3",
          front: "Which of the following is NOT a type of machine learning?\nA) Supervised learning\nB) Unsupervised learning\nC) Reinforcement learning\nD) Reactive learning",
          back: "D) Reactive learning",
          type: "mcq",
          difficulty: "medium"
        },
        {
          id: "4",
          front: "What is the main characteristic of unsupervised learning?",
          back: "Finding patterns in data without labels or known correct answers",
          type: "basic",
          difficulty: "easy"
        },
        {
          id: "5",
          front: "{{c1::Reinforcement learning}} involves agents learning through {{c2::trial and error}}, receiving {{c3::rewards}} for good actions.",
          back: "Reinforcement learning, trial and error, rewards",
          type: "cloze",
          difficulty: "hard"
        },
        {
          id: "6",
          front: "Name three key algorithms mentioned in the lecture",
          back: "Linear regression, decision trees, neural networks, K-means, Q-learning (any three)",
          type: "basic",
          difficulty: "medium"
        },
        {
          id: "7",
          front: "Which algorithm is commonly used for clustering in unsupervised learning?\nA) Linear regression\nB) Decision trees\nC) K-means\nD) Q-learning",
          back: "C) K-means",
          type: "mcq",
          difficulty: "medium"
        },
        {
          id: "8",
          front: "Applications of machine learning include {{c1::healthcare}}, {{c2::finance}}, {{c3::autonomous vehicles}}, and {{c4::natural language processing}}.",
          back: "healthcare, finance, autonomous vehicles, natural language processing",
          type: "cloze",
          difficulty: "easy"
        }
      ];

      // Filter by card type if not mixed
      let filteredCards = mockFlashcards;
      if (cardType !== "mixed") {
        filteredCards = mockFlashcards.filter(card => card.type === cardType);
      }

      // Adjust difficulty
      filteredCards = filteredCards.map(card => ({
        ...card,
        difficulty: difficulty
      }));

      // Limit to requested count
      const finalCards = filteredCards.slice(0, cardCount[0]);
      
      onFlashcardsGenerated(finalCards);
      
    } catch (error) {
      console.error("Flashcard generation error:", error);
      toast.error("Failed to generate flashcards. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Transcript Editor */}
      <div className="space-y-2">
        <Label htmlFor="transcript" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Transcript (Optional)
        </Label>
        <Textarea
          id="transcript"
          value={editedTranscript}
          onChange={(e) => setEditedTranscript(e.target.value)}
          placeholder="Review and edit your transcript before generating flashcards..."
          className="min-h-[200px] resize-none"
        />
        <p className="text-sm text-muted-foreground">
          {editedTranscript.length} characters • You can edit the transcript to improve flashcard quality
        </p>
      </div>

      {/* Generation Settings */}
      <Card className="bg-gray-50 dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Flashcard Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Type */}
            <div className="space-y-2">
              <Label>Card Type</Label>
              <Select value={cardType} onValueChange={(value: any) => setCardType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Types</SelectItem>
                  <SelectItem value="basic">Basic Q&A</SelectItem>
                  <SelectItem value="cloze">Cloze Deletion</SelectItem>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Count */}
            <div className="space-y-2">
              <Label>Number of Cards: {cardCount[0]}</Label>
              <Slider
                value={cardCount}
                onValueChange={setCardCount}
                max={20}
                min={5}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={generateFlashcards}
          disabled={isProcessing || !editedTranscript.trim()}
          size="lg"
          className="gap-2 px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Flashcards...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>

      {isProcessing && (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
              <p className="text-purple-900 dark:text-purple-100 font-medium">
                AI is analyzing your content...
              </p>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Creating {cardCount[0]} {cardType === "mixed" ? "mixed-type" : cardType} flashcards at {difficulty} difficulty
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlashcardGenerator;
