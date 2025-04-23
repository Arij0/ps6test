// src/app/components/app-game/app-game.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameSettingsService, GameSettings } from '../../services/game-settings.service';

@Component({
  selector: 'app-game',
  templateUrl: './app-game.component.html',
  styleUrls: ['./app-game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  // Configuration du jeu
  currentSentence: string = '';
  sentenceWithBlanks: string = '';
  words: string[] = [];
  correctWord: string = '';
  userAnswer: string = '';
  score: number = 0;
  currentQuestionIndex: number = 0;
  
  // Paramètres de jeu depuis le service
  settings: GameSettings;
  // Initialiser la propriété
  private settingsSubscription: Subscription = new Subscription();
  
  // Gestion du temps
  timeLeft: number = 60;
  maxTime: number = 60;
  timerInterval: any;
  timeExpired: boolean = false;
  
  // Messages d'encouragement
  encouragementMessages: string[] = [
    "Continue, tu y es presque !",
    "Prends ton temps, tu vas y arriver !",
    "N'abandonne pas, tu progresses bien !",
    "Essaie encore, tu peux le faire !",
    "Pas de stress, prends le temps qu'il te faut !"
  ];
  currentMessage: string = '';
  
  // Données d'indices
  hints: any[] = [];
  hintsUsed: number = 0;
  hintTimer: any;
  showHint: boolean = false;
  
  // Exemple de phrases (à remplacer par votre contenu réel)
  sentences: {text: string, missingWord: string, position: number}[] = [
    {
      text: "Le chien court dans le parc.",
      missingWord: "chien",
      position: 1
    },
    {
      text: "La voiture roule sur la route.",
      missingWord: "voiture",
      position: 1
    },
    {
      text: "Les oiseaux volent dans le ciel.",
      missingWord: "oiseaux",
      position: 1
    },
    {
      text: "Le soleil brille toute la journée.",
      missingWord: "soleil",
      position: 1
    },
    {
      text: "Les enfants jouent dans le jardin.",
      missingWord: "enfants",
      position: 1
    }
  ];
  
  // État du jeu
  gameOver: boolean = false;
  feedback: string = '';
  
  constructor(private gameSettingsService: GameSettingsService) {
    // Initialiser les settings avec les valeurs par défaut du service
    this.settings = this.gameSettingsService.getCurrentSettings();
  }
  
  ngOnInit(): void {
    // S'abonner aux changements de paramètres
    this.settingsSubscription = this.gameSettingsService.getSettings().subscribe((settings: GameSettings) => {
      this.settings = settings;
      this.applySettings();
    });
    
    this.startGame();
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    this.clearHintTimer();
  }
  
  // Reste du code...
}