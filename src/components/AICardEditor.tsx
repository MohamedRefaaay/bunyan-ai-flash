
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Wand2, CheckCircle, XCircle, Lightbulb, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Flashcard } from "@/pages/Index";

interface AICardEditorProps {
  card: Flashcard;
  onCardUpdate: (updatedCard: Flashcard) => void;
  onClose: () => void;
}

interface AISuggestion {
  id: string;
  type: "improve" | "simplify" | "cloze" | "mcq" | "reverse";
  title: string;
  description: string;
  suggestedFront: string;
  suggestedBack: string;
  suggestedType?: "basic" | "cloze" | "mcq";
}

const AICardEditor = ({ card, onCardUpdate, onClose }: AICardEditorProps) => {
  const [editedCard, setEditedCard] = useState<Flashcard>(card);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true);
    
    try {
      // Simulate AI suggestion generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions: AISuggestion[] = [
        {
          id: "improve",
          type: "improve",
          title: "Improve Clarity",
          description: "Make the question more specific and clear",
          suggestedFront: `What are the three main categories of machine learning, and what distinguishes each category from the others?`,
          suggestedBack: editedCard.back
        },
        {
          id: "simplify", 
          type: "simplify",
          title: "Simplify Language",
          description: "Use simpler terms for better understanding",
          suggestedFront: `What are the 3 types of machine learning?`,
          suggestedBack: `1. Supervised learning - learns from examples with answers\n2. Unsupervised learning - finds patterns without answers\n3. Reinforcement learning - learns through trial and error`
        },
        {
          id: "cloze",
          type: "cloze", 
          title: "Convert to Cloze",
          description: "Transform into a fill-in-the-blank format",
          suggestedFront: `The three main types of machine learning are {{c1::supervised learning}}, {{c2::unsupervised learning}}, and {{c3::reinforcement learning}}.`,
          suggestedBack: "supervised learning, unsupervised learning, reinforcement learning",
          suggestedType: "cloze"
        },
        {
          id: "mcq",
          type: "mcq",
          title: "Convert to Multiple Choice",
          description: "Create a multiple choice question",
          suggestedFront: `Which of the following is NOT a type of machine learning?\nA) Supervised learning\nB) Unsupervised learning\nC) Reinforcement learning\nD) Reactive learning`,
          suggestedBack: "D) Reactive learning",
          suggestedType: "mcq"
        },
        {
          id: "reverse",
          type: "reverse",
          title: "Reverse Question",
          description: "Flip the question and answer",
          suggestedFront: `Given these learning approaches: learning from labeled data, finding patterns in unlabeled data, and learning through rewards - what are these called in machine learning?`,
          suggestedBack: "These are the three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning"
        }
      ];
      
      setAiSuggestions(suggestions);
      toast.success("AI suggestions generated!");
      
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error("Failed to generate AI suggestions");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    const updatedCard = {
      ...editedCard,
      front: suggestion.suggestedFront,
      back: suggestion.suggestedBack,
      type: suggestion.suggestedType || editedCard.type
    };
    setEditedCard(updatedCard);
    setSelectedSuggestion(suggestion.id);
    toast.success("Suggestion applied!");
  };

  const saveCard = () => {
    onCardUpdate(editedCard);
    toast.success("Card updated successfully!");
    onClose();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "improve": return <Lightbulb className="h-4 w-4" />;
      case "simplify": return <RefreshCw className="h-4 w-4" />;
      case "cloze": return <Brain className="h-4 w-4" />;
      case "mcq": return <CheckCircle className="h-4 w-4" />;
      case "reverse": return <RefreshCw className="h-4 w-4" />;
      default: return <Wand2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Card Editor
          </h2>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question (Front)</label>
                <Textarea
                  value={editedCard.front}
                  onChange={(e) => setEditedCard({...editedCard, front: e.target.value})}
                  className="min-h-[120px]"
                  placeholder="Enter your question..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Answer (Back)</label>
                <Textarea
                  value={editedCard.back}
                  onChange={(e) => setEditedCard({...editedCard, back: e.target.value})}
                  className="min-h-[120px]"
                  placeholder="Enter your answer..."
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select 
                    value={editedCard.type} 
                    onValueChange={(value: any) => setEditedCard({...editedCard, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Q&A</SelectItem>
                      <SelectItem value="cloze">Cloze Deletion</SelectItem>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select 
                    value={editedCard.difficulty} 
                    onValueChange={(value: any) => setEditedCard({...editedCard, difficulty: value})}
                  >
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
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">AI Suggestions</h3>
                <Button 
                  onClick={generateAISuggestions}
                  disabled={isGeneratingSuggestions}
                  size="sm"
                  className="gap-2"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <Brain className="h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Get Suggestions
                    </>
                  )}
                </Button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {aiSuggestions.map((suggestion) => (
                    <Card 
                      key={suggestion.id} 
                      className={`cursor-pointer transition-all ${
                        selectedSuggestion === suggestion.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {getSuggestionIcon(suggestion.type)}
                            {suggestion.title}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applySuggestion(suggestion)}
                              className="h-6 px-2"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="font-medium">Q:</span> {suggestion.suggestedFront.substring(0, 80)}...
                          </div>
                          <div>
                            <span className="font-medium">A:</span> {suggestion.suggestedBack.substring(0, 80)}...
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {aiSuggestions.length === 0 && !isGeneratingSuggestions && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Click "Get Suggestions" to see AI recommendations</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveCard} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICardEditor;
