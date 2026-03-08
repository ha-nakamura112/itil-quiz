export type QuizItem = {
  question: string;
  options: string[];
  answer: number;        // correct option index
  description?: string;
};

export type QuizState = {
  order: number[];                  // index order
  currentPos: number;               // position in order
  selections: Array<number | null>; // selected per question index
  correct: Array<boolean | null>;   // correctness per question index
  shuffle: boolean;                 // mode
  createdAt: number;
};