// services/user-settings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserGameSettings } from 'src/models/user.module';
import { GameSettingsService } from '../services/game-settings.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private gameSettingsService: GameSettingsService
  ) {}

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    // Appliquer les paramètres au service de jeu
    if (user.settings) {
      this.applySettingsToGame(user.settings);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getDefaultSettings(): UserGameSettings {
    return {
      difficulty: 'medium',
      wordLength: false,
      similarLetters: false,       
      phoneticComplexity: false,
      hintType: 'text',
      hintsPerExercise: 2,
      hintsCount: 3,
      hintDelay: 10,
      gameSpeed: 5,
      interactionMode: 'mouse',
      timerEnabled: false,
      timerDuration: 60,
      hideWrongAnswers: false,
      showFinalScore: true,
      feedbackLevel: 'basic',
       secondChanceEnabled: false,
      maxAttempts: 2,
      removeWrongOption: false,
      showEncouragementOnSecondTry: true,
      autoHintOnSecondTry: false
    };
  }

  saveUserSettings(userId: number, settings: UserGameSettings): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/api/users/${userId}/settings`, { settings })
      .pipe(
        tap((updatedUser: User) => {
          this.setCurrentUser(updatedUser);
        })
      );
  }

  resetUserSettings(userId: number): Observable<User> {
    const defaultSettings = this.getDefaultSettings();
    return this.saveUserSettings(userId, defaultSettings);
  }

  // Appliquer les paramètres utilisateur au service de jeu
  private applySettingsToGame(settings: UserGameSettings): void {
    this.gameSettingsService.setHintsToShow(settings.hintsPerExercise);
    this.gameSettingsService.setHideWrongAnswers(settings.hideWrongAnswers);
    // Ajouter d'autres paramètres selon vos besoins
  }

  // Méthode pour récupérer les paramètres d'un utilisateur spécifique
  getUserSettings(userId: number): Observable<UserGameSettings> {
    return this.http.get<UserGameSettings>(`http://localhost:3000/api/users/${userId}/settings`);
  }
}