
export interface SummaryData {
  mainSummary: string;
  keyPoints: string[];
  mindMap: {
    topic: string;
    branches: Array<{
      title: string;
      points: string[];
      note: string;
    }>;
  };
  studyTips: string[];
  examPreparation: string[];
  difficultyConcepts: Array<{
    concept: string;
    explanation: string;
    level: 'easy' | 'medium' | 'hard';
  }>;
  timeEstimate: {
    studyTime: string;
    reviewTime: string;
    practiceTime: string;
  };
  relatedTopics: string[];
  practiceQuestions: Array<{
    question: string;
    type: 'multiple-choice' | 'essay' | 'short-answer';
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  keyTermsGlossary: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  learningObjectives: string[];
  commonMistakes: Array<{
    mistake: string;
    correction: string;
    tip: string;
  }>;
}

export interface DocumentSummarizerProps {
  documentContent: string;
  fileName: string;
}
