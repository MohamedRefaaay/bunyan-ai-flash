
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
