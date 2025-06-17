
import { ReactNode } from 'react';

export type AIProvider = 'gemini';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  keyLabel: string;
  keyLabelEn: string;
  placeholder: string;
  models: string[];
  icon: ReactNode;
  setupUrl: string;
}

export interface FlashcardGenerationRequest {
  content: string;
  title?: string;
  sourceType: 'document' | 'youtube' | 'audio' | 'visual' | 'custom';
  cardCount?: number;
}

export interface GeneratedFlashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  source: string;
  signature?: string;
}
