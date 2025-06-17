
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  type?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  session_id?: string;
  signature?: string;
}

export interface FlashcardStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}
