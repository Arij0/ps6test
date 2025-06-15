import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameSettingsService {
  public readonly hintsToShow$ = new BehaviorSubject<number>(1);
  public readonly hideWrongAnswers$ = new BehaviorSubject<boolean>(true);
  public readonly gameSpeed$ = new BehaviorSubject<number>(5);
  // Expose as observables
  public hintsToShow = this.hintsToShow$.asObservable();
  public hideWrongAnswers = this.hideWrongAnswers$.asObservable();
   public gameSpeed = this.gameSpeed$.asObservable();
    private speedPresets = {
    easy: 3,    // Plus lent pour les débutants
    medium: 5,  // Vitesse équilibrée
    hard: 7     // Plus rapide pour les experts
  };
  setGameSpeed(speed: number): void {
    // Valider que la vitesse est dans une plage acceptable (1-10)
    const validSpeed = Math.max(1, Math.min(10, speed));
    this.gameSpeed$.next(validSpeed);
  }
  getGameSpeed(): number {
    return this.gameSpeed$.getValue();
  }

  // Définir la vitesse automatiquement selon le niveau de difficulté
  setGameSpeedByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    const speed = this.speedPresets[difficulty];
    this.setGameSpeed(speed);
  }

  // Obtenir la vitesse recommandée pour un niveau
  getRecommendedSpeed(difficulty: 'easy' | 'medium' | 'hard'): number {
    return this.speedPresets[difficulty];
  }

  // Obtenir le label descriptif de la vitesse
  getSpeedLabel(speed: number): string {
    if (speed <= 2) return 'Très lent';
    if (speed <= 4) return 'Lent';
    if (speed <= 6) return 'Normal';
    if (speed <= 8) return 'Rapide';
    return 'Très rapide';
  }

  // Obtenir la description de l'impact de la vitesse
  getSpeedDescription(speed: number): string {
    if (speed <= 2) return 'Idéal pour prendre son temps et bien réfléchir';
    if (speed <= 4) return 'Permet une réflexion posée sans stress';
    if (speed <= 6) return 'Rythme équilibré entre réflexion et dynamisme';
    if (speed <= 8) return 'Stimule la réactivité et la concentration';
    return 'Pour les joueurs expérimentés qui aiment les défis';
  }

  // Methods remain unchanged
  setHintsToShow(count: number): void {
    this.hintsToShow$.next(count);
  }

  setHideWrongAnswers(hide: boolean): void {
    this.hideWrongAnswers$.next(hide);
  }
  getHintsToShow(): number {
    return this.hintsToShow$.getValue();
  }

  getHideWrongAnswers(): boolean {
    return this.hideWrongAnswers$.getValue();
  }
   resetAllSettings(): void {
    this.setHintsToShow(1);
    this.setHideWrongAnswers(true);
    this.setGameSpeed(5); // Vitesse par défaut
  }
}