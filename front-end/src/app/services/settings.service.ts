// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Importez Observable

// INTERFACE POUR LES PARAMÈTRES (TRÈS IMPORTANT POUR LE TYPAGE)
// Ajoutez TOUS les champs de votre settingsForm ici avec leur type
export interface AppSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  wordLength: boolean;
  selectedWordLength: number | null; // AJOUTÉ : Pour la longueur spécifique
  wordLengthRange: 'all' | 'specific' | 'range'; // AJOUTÉ : Pour le type de sélection de longueur
  customMinWordLength: number | null; // AJOUTÉ : Pour la longueur min personnalisée
  customMaxWordLength: number | null; // AJOUTÉ : Pour la longueur max personnalisée

  similarLetters: boolean;
  phoneticComplexity: boolean; // Ou 'number' si c'est un niveau
  hintType: string;
  hintsPerExercise: number;
  hintDelay: number;
  gameSpeed: number;
  interactionMode: string;
  timerEnabled: boolean;
  timerDuration: number;
  hideWrongAnswers: boolean;
  showFinalScore: boolean;
  feedbackLevel: string;
  similarLetterGroups: string[][]; // Devrait être [] par défaut si non utilisé
  secondChanceEnabled: boolean;
  maxAttempts: number;
  removeWrongOption: boolean;
  showEncouragementOnSecondTry: boolean;
  autoHintOnSecondTry: boolean;
  showHintSuggestionAfterError: boolean;
  hintSuggestionDelay: number;
  allowExtraHintAfterError: boolean;
  customEncouragementMessage: string;
  reduceOptionsOnSecondTry: boolean;
  highlightCorrectArea: boolean;
  penalizeIncorrectAttempts: boolean;
  scorePenaltyPercentage: number;
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultSettings: AppSettings = { // Utilisez votre interface ici
    difficulty: 'medium',
    wordLength: true,
    selectedWordLength: null, // AJOUTÉ : Par défaut
    wordLengthRange: 'all',   // AJOUTÉ : Par défaut
    customMinWordLength: null, // AJOUTÉ : Par défaut
    customMaxWordLength: null, // AJOUTÉ : Par défaut

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

    autoHintOnSecondTry: false,
    showHintSuggestionAfterError: true,
    hintSuggestionDelay: 3,
    allowExtraHintAfterError: true,

    customEncouragementMessage: '',
    reduceOptionsOnSecondTry: true,
    highlightCorrectArea: false,
    penalizeIncorrectAttempts: false,
    scorePenaltyPercentage: 25
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.defaultSettings); // Utilisez AppSettings ici
  public settings$: Observable<AppSettings> = this.settingsSubject.asObservable(); // Ajoutez 'Observable' pour le typage correct

  constructor() {
    // Charger les paramètres depuis localStorage s'ils existent
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      // Fusionner avec defaultSettings pour s'assurer que tous les champs sont présents
      this.settingsSubject.next({ ...this.defaultSettings, ...JSON.parse(savedSettings) });
    }
  }

  // Renommée de `updateSettings` en `setSettings` pour la cohérence avec mes exemples précédents
  // SI VOUS VOULEZ GARDER `updateSettings`, il faudra l'utiliser partout.
  // Je recommande de la garder `updateSettings` si c'est déjà utilisé ailleurs.
  updateSettings(settings: AppSettings): void { // Utilisez AppSettings pour le paramètre
    try {
      const currentSettings = this.settingsSubject.value;
      const updatedSettings = { ...currentSettings, ...settings };

      localStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
      this.settingsSubject.next(updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  }

  getSettings(): AppSettings { // Utilisez AppSettings pour le retour
    return this.settingsSubject.value;
  }

  resetSettings(): void {
    localStorage.removeItem('gameSettings');
    this.settingsSubject.next(this.defaultSettings);
  }

  // Ces méthodes spécifiques sont bien, elles utilisent updateSettings
  setSimilarLetterGroups(groups: string[][]): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, similarLetterGroups: groups };
    this.updateSettings(updatedSettings);
  }

  getSimilarLetterGroups(): string[][] {
    return this.settingsSubject.value.similarLetterGroups || [];
  }

  getHintSettings(): any { // Considérez un type plus spécifique ici
    const settings = this.settingsSubject.value;
    return {
      hintsPerExercise: settings.hintsPerExercise,
      autoHintOnSecondTry: settings.autoHintOnSecondTry,
      showHintSuggestionAfterError: settings.showHintSuggestionAfterError,
      hintSuggestionDelay: settings.hintSuggestionDelay,
      allowExtraHintAfterError: settings.allowExtraHintAfterError
    };
  }

  getSecondChanceSettings(): any { // Considérez un type plus spécifique ici
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

  validateSettings(): { isValid: boolean; errors: string[] } {
    const settings = this.settingsSubject.value;
    const errors: string[] = [];

    if (settings.allowExtraHintAfterError && settings.hintsPerExercise === 0) {
      errors.push('Impossible d\'autoriser un indice supplémentaire si aucun indice n\'est disponible');
    }

    if (settings.autoHintOnSecondTry && settings.allowExtraHintAfterError) {
      errors.push('L\'indice automatique et l\'indice supplémentaire manuel ne peuvent pas être activés simultanément');
    }

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