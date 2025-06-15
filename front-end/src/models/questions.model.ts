export interface Question {
    id?:number;
    text: string;
    options: string[];
    answer: string;
    hints: string[];
    wordLength: number;
    hasSimilarLetters: boolean;
    phoneticComplexity: number;
    isCustom?: boolean;
     category?: string
}
export interface DifficultySettings {  
  level: 'easy' | 'medium' | 'hard';
  label: string;
  description: string;
  settings: {
    minWordLength: number;
    maxWordLength: number;
    allowWordLengthSelection: boolean,
    wordLengthOptions:number[],
    includeSimilarLetters: boolean;
    phoneticComplexityLevel: number;
    hintsPerExercise: number;
    timerEnabled: boolean;
    timerDuration: number;
    secondChanceEnabled: boolean;
    maxAttempts: number;
    showEncouragementOnSecondTry: boolean;
    autoHintOnSecondTry: boolean;
    reduceOptionsOnSecondTry: boolean;
    penalizeIncorrectAttempts: boolean;
    scorePenaltyPercentage: number;
  }
}