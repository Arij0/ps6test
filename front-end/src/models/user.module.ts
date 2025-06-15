// models/user.model.ts
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  settings?: UserGameSettings; // Nouveaux paramètres par utilisateur
  createdAt?: Date;
}

export interface UserGameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  wordLength: boolean;
  similarLetters: boolean;
  phoneticComplexity: boolean;
  hintType: 'text' | 'animation' | 'image' | 'audio';
  hintsPerExercise: number;
  hintsCount: number;
  hintDelay: number;
  gameSpeed: number;
  interactionMode: 'mouse' | 'voice' | 'keyboard';
  timerEnabled: boolean;
  timerDuration: number;
  hideWrongAnswers: boolean;
  showFinalScore: boolean;
  feedbackLevel: 'none' | 'basic' | 'detailed' | 'very-detailed';
  secondChanceEnabled: boolean;
  maxAttempts: number;
  removeWrongOption: boolean;
  showEncouragementOnSecondTry: boolean;
  autoHintOnSecondTry: boolean;
}