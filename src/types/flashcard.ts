
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: "basic" | "cloze" | "mcq";
  difficulty: "easy" | "medium" | "hard";
  created_at?: string;
  updated_at?: string;
}
