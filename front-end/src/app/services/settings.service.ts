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
    similarLetterGroups: []
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
    // Sauvegarder dans localStorage et mettre à jour le BehaviorSubject
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    this.settingsSubject.next(settings);
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
}