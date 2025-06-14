
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Download, Filter, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecommendationEngineProps {
  transcript: string;
  onRecommendationsApply: (cards: any[]) => void;
}

const SmartRecommendationEngine = ({ transcript, onRecommendationsApply }: RecommendationEngineProps) => {
  const [detectedTopic, setDetectedTopic] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  useEffect(() => {
    // Simulate topic detection
    const topics = ['Computer Science', 'Medicine', 'Engineering', 'Business', 'Science'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setDetectedTopic(randomTopic);
    
    // Generate mock recommendations
    const mockRecommendations = [
      {
        id: 'rec-1',
        title: 'Machine Learning Fundamentals',
        field: 'Computer Science',
        difficulty: 'medium',
        rating: 4.8,
        cardCount: 25,
        description: 'Core concepts in ML algorithms'
      },
      {
        id: 'rec-2',
        title: 'Data Structures Essentials',
        field: 'Computer Science',
        difficulty: 'easy',
        rating: 4.9,
        cardCount: 18,
        description: 'Arrays, linked lists, trees basics'
      },
      {
        id: 'rec-3',
        title: 'Neural Networks Deep Dive',
        field: 'Computer Science',
        difficulty: 'hard',
        rating: 4.7,
        cardCount: 35,
        description: 'Advanced neural network concepts'
      }
    ];
    setRecommendations(mockRecommendations);
  }, [transcript]);

  const filteredRecommendations = recommendations.filter(rec => {
    const fieldMatch = selectedField === 'all' || rec.field === selectedField;
    const difficultyMatch = difficulty === 'all' || rec.difficulty === difficulty;
    return fieldMatch && difficultyMatch;
  });

  const applyRecommendation = (rec: any) => {
    // Simulate applying recommendation
    const cards = Array.from({ length: rec.cardCount }, (_, i) => ({
      id: `${rec.id}-card-${i}`,
      front: `Question ${i + 1} from ${rec.title}`,
      back: `Answer ${i + 1} covering ${rec.description}`,
      type: 'basic',
      difficulty: rec.difficulty
    }));
    onRecommendationsApply(cards);
  };

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
                <Button size="sm" onClick={() => applyRecommendation(rec)}>
                  <Download className="h-3 w-3" />
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
