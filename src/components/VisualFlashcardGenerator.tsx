
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const generateVisualCards = async () => {
    setIsGenerating(true);
    
    // Simulate AI visual generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockVisualCards = [
      {
        id: 'visual-1',
        type: 'diagram',
        title: 'Learning Process Flow',
        description: 'Visual representation of the learning process',
        svgContent: '<svg viewBox="0 0 400 200"><rect x="10" y="10" width="80" height="40" fill="#e3f2fd" stroke="#1976d2"/><text x="50" y="35" text-anchor="middle">Input</text><path d="M90 30 L130 30" stroke="#1976d2" marker-end="url(#arrowhead)"/><rect x="130" y="10" width="80" height="40" fill="#f3e5f5" stroke="#7b1fa2"/><text x="170" y="35" text-anchor="middle">Process</text><path d="M210 30 L250 30" stroke="#7b1fa2" marker-end="url(#arrowhead)"/><rect x="250" y="10" width="80" height="40" fill="#e8f5e8" stroke="#388e3c"/><text x="290" y="35" text-anchor="middle">Output</text></svg>'
      },
      {
        id: 'visual-2',
        type: 'mindmap',
        title: 'Concept Connections',
        description: 'Mind map of key concepts',
        svgContent: '<svg viewBox="0 0 400 300"><circle cx="200" cy="150" r="40" fill="#fff3e0" stroke="#f57c00"/><text x="200" y="155" text-anchor="middle">Main Topic</text><circle cx="100" cy="80" r="30" fill="#e8f5e8" stroke="#388e3c"/><text x="100" y="85" text-anchor="middle">Concept A</text><line x1="170" y1="125" x2="125" y2="95" stroke="#666"/></svg>'
      }
    ];
    
    onVisualCardsGenerated(mockVisualCards);
    setIsGenerating(false);
    toast.success(`Generated ${mockVisualCards.length} visual cards`);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Visual Flashcard Generator
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
      </CardContent>
    </Card>
  );
};

export default VisualFlashcardGenerator;
