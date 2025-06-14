
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Download, Star, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RecommendationEngineProps {
  transcript: string;
  onRecommendationsApply: (cards: any[]) => void;
}

const SmartRecommendationEngine = ({ transcript, onRecommendationsApply }: RecommendationEngineProps) => {
  const [detectedTopic, setDetectedTopic] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (transcript) {
      // Smart topic detection based on transcript content
      let detectedField = 'General';
      const lowerTranscript = transcript.toLowerCase();
      
      if (lowerTranscript.includes('machine learning') || lowerTranscript.includes('algorithm') || lowerTranscript.includes('neural network')) {
        detectedField = 'Computer Science - AI/ML';
      } else if (lowerTranscript.includes('medicine') || lowerTranscript.includes('patient') || lowerTranscript.includes('treatment')) {
        detectedField = 'Medicine';
      } else if (lowerTranscript.includes('business') || lowerTranscript.includes('marketing') || lowerTranscript.includes('management')) {
        detectedField = 'Business';
      } else if (lowerTranscript.includes('engineering') || lowerTranscript.includes('design') || lowerTranscript.includes('technical')) {
        detectedField = 'Engineering';
      }
      
      setDetectedTopic(detectedField);
      
      // Generate contextual recommendations
      const contextualRecommendations = [
        {
          id: 'rec-1',
          title: 'Core Concepts Extraction',
          field: detectedField,
          difficulty: 'medium',
          rating: 4.9,
          cardCount: Math.min(15, Math.floor(transcript.length / 100)),
          description: 'Extract key concepts and definitions from your content'
        },
        {
          id: 'rec-2',
          title: 'Q&A Generation',
          field: detectedField,
          difficulty: 'easy',
          rating: 4.8,
          cardCount: Math.min(20, Math.floor(transcript.length / 80)),
          description: 'Generate question-answer pairs from important points'
        },
        {
          id: 'rec-3',
          title: 'Advanced Analysis',
          field: detectedField,
          difficulty: 'hard',
          rating: 4.7,
          cardCount: Math.min(10, Math.floor(transcript.length / 150)),
          description: 'Deep analytical questions for complex understanding'
        }
      ];
      setRecommendations(contextualRecommendations);
    }
  }, [transcript]);

  const filteredRecommendations = recommendations.filter(rec => {
    const fieldMatch = selectedField === 'all' || rec.field.includes(selectedField);
    const difficultyMatch = difficulty === 'all' || rec.difficulty === difficulty;
    return fieldMatch && difficultyMatch;
  });

  const applyRecommendation = (rec: any) => {
    if (appliedRecommendations.has(rec.id)) {
      toast.info("This recommendation has already been applied");
      return;
    }

    // Generate smart cards based on recommendation type
    const cards = Array.from({ length: rec.cardCount }, (_, i) => {
      let front, back, type;
      
      if (rec.title.includes('Core Concepts')) {
        front = `What is the key concept #${i + 1} discussed in the lecture?`;
        back = `[Concept from transcript analysis - would extract actual key terms]`;
        type = 'basic';
      } else if (rec.title.includes('Q&A')) {
        front = `Question ${i + 1}: [Generated from transcript content]`;
        back = `Answer based on lecture material analysis`;
        type = 'basic';
      } else {
        front = `Analyze and explain the relationship between concepts ${i + 1} and ${i + 2}`;
        back = `Deep analytical answer requiring synthesis of multiple concepts`;
        type = 'basic';
      }

      return {
        id: `${rec.id}-card-${i}`,
        front,
        back,
        type,
        difficulty: rec.difficulty
      };
    });

    onRecommendationsApply(cards);
    setAppliedRecommendations(prev => new Set([...prev, rec.id]));
    toast.success(`Applied "${rec.title}" - Generated ${rec.cardCount} cards!`);
  };

  if (!transcript) {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Upload content to get smart recommendations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Smart Recommendations
        </CardTitle>
        {detectedTopic && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Detected topic:</span>
            <Badge variant="secondary">{detectedTopic}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredRecommendations.map((rec) => (
            <div key={rec.id} className="p-3 border rounded-lg bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{rec.field}</Badge>
                    <Badge variant="outline" className="text-xs">{rec.difficulty}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{rec.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{rec.cardCount} cards</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => applyRecommendation(rec)}
                  disabled={appliedRecommendations.has(rec.id)}
                  variant={appliedRecommendations.has(rec.id) ? "outline" : "default"}
                >
                  {appliedRecommendations.has(rec.id) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationEngine;
