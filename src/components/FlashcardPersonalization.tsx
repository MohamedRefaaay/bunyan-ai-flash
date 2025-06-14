
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Zap, Target, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PersonalizationProps {
  onStyleChange: (style: any) => void;
}

const FlashcardPersonalization = ({ onStyleChange }: PersonalizationProps) => {
  const [selectedMode, setSelectedMode] = useState('basic');
  const [selectedTheme, setSelectedTheme] = useState('default');

  const modes = [
    {
      id: 'basic',
      name: 'Basic Educational',
      icon: BookOpen,
      description: 'Definition-based learning',
      color: 'blue'
    },
    {
      id: 'exam',
      name: 'Exam Prep',
      icon: Target,
      description: 'MCQs and timed recall',
      color: 'purple'
    },
    {
      id: 'challenge',
      name: 'Challenge Mode',
      icon: Zap,
      description: 'Reverse questioning & cloze',
      color: 'orange'
    },
    {
      id: 'fast',
      name: 'Fast Review',
      icon: Clock,
      description: 'Minimalist UI',
      color: 'green'
    }
  ];

  const themes = [
    { id: 'default', name: 'Default', colors: 'bg-white text-gray-900' },
    { id: 'dark', name: 'Dark', colors: 'bg-gray-900 text-white' },
    { id: 'blue', name: 'Ocean', colors: 'bg-blue-50 text-blue-900' },
    { id: 'green', name: 'Forest', colors: 'bg-green-50 text-green-900' },
    { id: 'purple', name: 'Royal', colors: 'bg-purple-50 text-purple-900' }
  ];

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    onStyleChange({ mode, theme: selectedTheme });
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    onStyleChange({ mode: selectedMode, theme });
  };

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Flashcard Personalization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="modes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modes">Study Modes</TabsTrigger>
            <TabsTrigger value="themes">Visual Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modes" className="space-y-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedMode === mode.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleModeChange(mode.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">{mode.name}</h4>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                    {selectedMode === mode.id && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="themes" className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${theme.colors} ${
                    selectedTheme === theme.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <div className="text-center">
                    <h4 className="font-medium">{theme.name}</h4>
                    <div className="mt-2 h-8 rounded border opacity-50"></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FlashcardPersonalization;
