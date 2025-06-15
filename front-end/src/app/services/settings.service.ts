// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultSettings = {
    difficulty: 'medium',
    wordLength: true,
    similarLetters: true,
    phoneticComplexity: true,
    hintType: 'text',
    hintsPerExercise: 3,
    hintDelay: 5,
    gameSpeed: 5,
    interactionMode: 'mouse',
    timerEnabled: false,
    timerDuration: 60,
    hideWrongAnswers: true,
    showFinalScore: true,
    feedbackLevel: 'detailed',
    similarLetterGroups: [],
     secondChanceEnabled: true,
    maxAttempts: 2,
    removeWrongOption: true,
    showEncouragementOnSecondTry: true,
    
    // NOUVEAUX PARAMÈTRES pour la gestion des indices
    autoHintOnSecondTry: false, // L'indice ne s'affiche PAS automatiquement
    showHintSuggestionAfterError: true, // Mais on suggère à l'enfant de cliquer
    hintSuggestionDelay: 3, // Délai avant d'afficher la suggestion
    allowExtraHintAfterError: true, // Permet un indice supplémentaire après erreur
    
    // Paramètres d'encouragement
    customEncouragementMessage: '',
    reduceOptionsOnSecondTry: true,
    highlightCorrectArea: false,
    penalizeIncorrectAttempts: false,
    scorePenaltyPercentage: 25
  };

  private settingsSubject = new BehaviorSubject<any>(this.defaultSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Charger les paramètres depuis localStorage s'ils existent
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      this.settingsSubject.next(JSON.parse(savedSettings));
    }
  }

  updateSettings(settings: any): void {
    try {
      // Fusionner avec les paramètres existants
      const currentSettings = this.settingsSubject.value;
      const updatedSettings = { ...currentSettings, ...settings };
      
      // Sauvegarder dans localStorage et mettre à jour le BehaviorSubject
      localStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
      this.settingsSubject.next(updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  }

  getSettings(): any {
    return this.settingsSubject.value;
  }

  resetSettings(): void {
    localStorage.removeItem('gameSettings');
    this.settingsSubject.next(this.defaultSettings);
  }
  setSimilarLetterGroups(groups: string[][]): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, similarLetterGroups: groups };
    this.updateSettings(updatedSettings);
  }

  getSimilarLetterGroups(): string[][] {
    return this.settingsSubject.value.similarLetterGroups || [];
  }
   getHintSettings(): any {
    const settings = this.settingsSubject.value;
    return {
      hintsPerExercise: settings.hintsPerExercise,
      autoHintOnSecondTry: settings.autoHintOnSecondTry,
      showHintSuggestionAfterError: settings.showHintSuggestionAfterError,
      hintSuggestionDelay: settings.hintSuggestionDelay,
      allowExtraHintAfterError: settings.allowExtraHintAfterError
    };
  }

  getSecondChanceSettings(): any {
    const settings = this.settingsSubject.value;
    return {
      secondChanceEnabled: settings.secondChanceEnabled,
      maxAttempts: settings.maxAttempts,
      removeWrongOption: settings.removeWrongOption,
      showEncouragementOnSecondTry: settings.showEncouragementOnSecondTry,
      customEncouragementMessage: settings.customEncouragementMessage,
      reduceOptionsOnSecondTry: settings.reduceOptionsOnSecondTry,
      highlightCorrectArea: settings.highlightCorrectArea,
      penalizeIncorrectAttempts: settings.penalizeIncorrectAttempts,
      scorePenaltyPercentage: settings.scorePenaltyPercentage
    };
  }

  // Méthode pour valider la cohérence des paramètres
  validateSettings(): { isValid: boolean; errors: string[] } {
    const settings = this.settingsSubject.value;
    const errors: string[] = [];

    // Validation des indices
    if (settings.allowExtraHintAfterError && settings.hintsPerExercise === 0) {
      errors.push('Impossible d\'autoriser un indice supplémentaire si aucun indice n\'est disponible');
    }

    if (settings.autoHintOnSecondTry && settings.allowExtraHintAfterError) {
      errors.push('L\'indice automatique et l\'indice supplémentaire manuel ne peuvent pas être activés simultanément');
    }

    // Validation de la seconde chance
    if (settings.secondChanceEnabled) {
      if (settings.maxAttempts < 2 || settings.maxAttempts > 3) {
        errors.push('Le nombre de tentatives doit être entre 2 et 3');
      }

      if (settings.penalizeIncorrectAttempts && 
          (settings.scorePenaltyPercentage < 0 || settings.scorePenaltyPercentage > 100)) {
        errors.push('Le pourcentage de pénalité doit être entre 0 et 100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
}
