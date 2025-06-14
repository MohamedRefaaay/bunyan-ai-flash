
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, BarChart3, Network, Table } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.error("Please upload and transcribe content first");
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockVisualCards = [
      {
        id: 'visual-1',
        front: 'Machine Learning Process Flow',
        back: 'Input Data → Processing → Model Training → Prediction/Output',
        type: 'basic',
        difficulty: 'medium',
        visual: true,
        svgContent: '<svg viewBox="0 0 400 200" class="w-full h-32"><rect x="10" y="80" width="80" height="40" fill="#e3f2fd" stroke="#1976d2" rx="5"/><text x="50" y="105" text-anchor="middle" class="text-sm">Input</text><path d="M90 100 L130 100" stroke="#1976d2" stroke-width="2" marker-end="url(#arrowhead)"/><rect x="130" y="80" width="80" height="40" fill="#f3e5f5" stroke="#7b1fa2" rx="5"/><text x="170" y="105" text-anchor="middle" class="text-sm">Process</text><path d="M210 100 L250 100" stroke="#7b1fa2" stroke-width="2"/><rect x="250" y="80" width="80" height="40" fill="#e8f5e8" stroke="#388e3c" rx="5"/><text x="290" y="105" text-anchor="middle" class="text-sm">Output</text></svg>'
      },
      {
        id: 'visual-2',
        front: 'Learning Types Comparison',
        back: 'Supervised: Labeled data | Unsupervised: Pattern finding | Reinforcement: Trial & error',
        type: 'basic',
        difficulty: 'medium',
        visual: true,
        svgContent: '<svg viewBox="0 0 400 200" class="w-full h-32"><circle cx="100" cy="100" r="50" fill="#ffeb3b" stroke="#f57c00" stroke-width="2"/><text x="100" y="105" text-anchor="middle" class="text-xs">Supervised</text><circle cx="200" cy="100" r="50" fill="#e8f5e8" stroke="#4caf50" stroke-width="2"/><text x="200" y="105" text-anchor="middle" class="text-xs">Unsupervised</text><circle cx="300" cy="100" r="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2"/><text x="300" y="105" text-anchor="middle" class="text-xs">Reinforcement</text></svg>'
      },
      {
        id: 'visual-3',
        front: 'Algorithm Classification Table',
        back: 'Linear Regression: Supervised | K-means: Unsupervised | Q-learning: Reinforcement',
        type: 'basic',
        difficulty: 'hard',
        visual: true,
        tableData: [
          ['Algorithm', 'Type', 'Use Case'],
          ['Linear Regression', 'Supervised', 'Prediction'],
          ['K-means', 'Unsupervised', 'Clustering'],
          ['Q-learning', 'Reinforcement', 'Game AI']
        ]
      }
    ];
    
    setGeneratedCards(mockVisualCards);
    onVisualCardsGenerated(mockVisualCards);
    setIsGenerating(false);
    toast.success(`Generated ${mockVisualCards.length} visual flashcards!`);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Visual Flashcard Generator
          {generatedCards.length > 0 && (
            <Badge variant="secondary">{generatedCards.length} cards</Badge>
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
            Diagrams
          </Button>
          <Button
            variant={visualType === 'table' ? 'default' : 'outline'}
            onClick={() => setVisualType('table')}
            className="gap-2"
            size="sm"
          >
            <Table className="h-4 w-4" />
            Tables
          </Button>
          <Button
            variant={visualType === 'mindmap' ? 'default' : 'outline'}
            onClick={() => setVisualType('mindmap')}
            className="gap-2"
            size="sm"
          >
            <Network className="h-4 w-4" />
            Mind Maps
          </Button>
          <Button
            variant={visualType === 'concept' ? 'default' : 'outline'}
            onClick={() => setVisualType('concept')}
            className="gap-2"
            size="sm"
          >
            <Image className="h-4 w-4" />
            Concepts
          </Button>
        </div>
        
        <Button 
          onClick={generateVisualCards}
          disabled={isGenerating || !transcript}
          className="w-full"
        >
          {isGenerating ? 'Generating Visual Cards...' : 'Generate Visual Cards'}
        </Button>

        {generatedCards.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-medium mb-3">Generated Visual Cards Preview</h4>
            <div className="space-y-2">
              {generatedCards.map((card, index) => (
                <div key={card.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span>{card.front}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualFlashcardGenerator;
