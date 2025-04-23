import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameSettingsService } from '../../services/game-settings.service';
import { GameSettings } from '../game-settings/game-settings.component';

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
  private settingsSubscription: Subscription;
  
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
    this.settings = this.gameSettingsService.getCurrentSettings();
  }
  
  ngOnInit(): void {
    // S'abonner aux changements de paramètres
    this.settingsSubscription = this.gameSettingsService.getSettings().subscribe(settings => {
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
  
  applySettings(): void {
    // Appliquer les paramètres au jeu en cours
    
    // Timer settings
    this.maxTime = this.settings.timerEnabled ? this.settings.timerDuration : 999999;
    this.timeLeft = this.maxTime;
    
    // Filter sentences based on difficulty settings
    this.filterSentencesByDifficulty();
    
    // Apply game speed (adjust according to your needs)
    // Example: could modify animation speed, countdown speed, etc.
    
    // Restart timer with new settings
    if (this.timerInterval) {
      this.stopTimer();
      this.startTimer();
    }
  }
  
  filterSentencesByDifficulty(): void {
    // Implémentation à faire: filtrer les phrases selon la difficulté
    // Ceci est un exemple simple, vous devrez l'adapter à vos besoins
    
    // Filter by word length
    // Filter by confusable letters
    // Filter by phonetic complexity
  }
  
  startGame(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.timeExpired = false;
    this.gameOver = false;
    this.feedback = '';
    
    this.applySettings();
    this.loadQuestion();
    
    if (this.settings.timerEnabled) {
      this.startTimer();
    }
  }
  
  loadQuestion(): void {
    if (this.currentQuestionIndex < this.sentences.length) {
      const sentence = this.sentences[this.currentQuestionIndex];
      this.currentSentence = sentence.text;
      this.correctWord = sentence.missingWord;
      
      // Créer la phrase avec un blanc
      const words = this.currentSentence.split(' ');
      words[sentence.position] = '_______';
      this.sentenceWithBlanks = words.join(' ');
      
      // Préparer des mots pour le choix (incluant le mot correct)
      this.prepareWordChoices();
      
      // Réinitialiser les indices pour cette question
      this.hintsUsed = 0;
      this.showHint = false;
      this.clearHintTimer();
      
      // Préparer les indices pour cette question
      this.prepareHints();
    } else {
      this.finishGame();
    }
  }
  
  prepareWordChoices(): void {
    // Créer des choix de mots (incluant le mot correct)
    // Ces mots seront des options pour l'utilisateur
    const allWords = ['maison', 'table', 'livre', 'école', 'arbre', 'chat', 'chien', 'voiture', 'soleil', 'oiseaux', 'enfants'];
    
    // Mélanger les mots
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    
    // Sélectionner quelques mots (excluant le mot correct s'il est dans la liste)
    const randomWords = shuffled
      .filter(word => word !== this.correctWord)
      .slice(0, 3);
    
    // Ajouter le mot correct et mélanger à nouveau
    this.words = [...randomWords, this.correctWord].sort(() => 0.5 - Math.random());
  }
  
  prepareHints(): void {
    // Dans une version complète, vous créeriez différents types d'indices
    // basés sur les paramètres du jeu (this.settings.hintType)
    this.hints = [
      { type: 'text', content: `Ce mot commence par la lettre "${this.correctWord[0]}"` },
      { type: 'text', content: `Ce mot a ${this.correctWord.length} lettres` },
      { type: 'text', content: `Ce mot se termine par "${this.correctWord.slice(-2)}"` },
    ];
  }
  
  useHint(): void {
    if (this.hintsUsed < this.settings.hintsCount && this.hints.length > this.hintsUsed) {
      // Afficher l'indice
      this.showHint = true;
      this.hintsUsed++;
      
      // Programmer la disparition de l'indice après un certain temps
      this.clearHintTimer();
      this.hintTimer = setTimeout(() => {
        this.showHint = false;
      }, 5000); // L'indice restera visible pendant 5 secondes
    }
  }
  
  clearHintTimer(): void {
    if (this.hintTimer) {
      clearTimeout(this.hintTimer);
      this.hintTimer = null;
    }
  }
  
  startTimer(): void {
    this.stopTimer();
    this.timeLeft = this.maxTime;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.timeExpired = true;
        this.stopTimer();
        this.finishGame();
      }
    }, 1000);
  }
  
  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  checkAnswer(selectedWord: string): void {
    this.userAnswer = selectedWord;
    
    if (selectedWord === this.correctWord) {
      // Réponse correcte
      this.score++;
      this.provideFeedback(true);
      
      // Passer à la question suivante après un court délai
      setTimeout(() => {
        this.currentQuestionIndex++;
        this.loadQuestion();
      }, 1500);
    } else {
      // Réponse incorrecte
      this.provideFeedback(false);
      
      // Si on a activé le masquage des mauvaises réponses
      if (this.settings.hideIncorrectAnswers) {
        this.words = this.words.filter(word => word !== selectedWord);
      }
      
      // Si on a des indices configurés, démarrer le timer pour afficher un indice
      if (this.settings.hintDelay > 0 && this.hintsUsed < this.settings.hintsCount) {
        this.clearHintTimer();
        this.hintTimer = setTimeout(() => {
          this.useHint();
        }, this.settings.hintDelay * 1000);
      }
      
      // Afficher un message d'encouragement aléatoire
      this.showEncouragementMessage();
    }
  }
  
  showEncouragementMessage(): void {
    const randomIndex = Math.floor(Math.random() * this.encouragementMessages.length);
    this.currentMessage = this.encouragementMessages[randomIndex];
    
    // Effacer le message après quelques secondes
    setTimeout(() => {
      this.currentMessage = '';
    }, 3000);
  }
  
  provideFeedback(isCorrect: boolean): void {
    // Appliquer le niveau de feedback configuré
    switch (this.settings.feedbackLevel) {
      case 'none':
        this.feedback = '';
        break;
      case 'basic':
        this.feedback = isCorrect ? 'Correct !' : 'Incorrect.';
        break;
      case 'detailed':
        if (isCorrect) {
          this.feedback = 'Bravo ! Tu as trouvé la bonne réponse.';
        } else {
          this.feedback = `Ce n'est pas la bonne réponse. Essaie encore !`;
        }
        break;
      case 'very-detailed':
        if (isCorrect) {
          this.feedback = `Excellent travail ! "${this.correctWord}" est la bonne réponse.`;
        } else {
          this.feedback = `"${this.userAnswer}" n'est pas la bonne réponse. Le mot correct devrait compléter la phrase : "${this.currentSentence}".`;
        }
        break;
    }
    
    // Effacer le feedback après quelques secondes
    setTimeout(() => {
      this.feedback = '';
    }, 3000);
  }
  
  finishGame(): void {
    this.gameOver = true;
    this.stopTimer();
    this.clearHintTimer();
    
    // Détermine le message final en fonction du score
    const finalScorePercentage = (this.score / this.sentences.length) * 100;
    
    if (this.settings.showFinalScore) {
      if (finalScorePercentage >= 80) {
        this.feedback = `Félicitations ! Tu as obtenu ${this.score} sur ${this.sentences.length} points. Excellent travail !`;
      } else if (finalScorePercentage >= 50) {
        this.feedback = `Bien joué ! Tu as obtenu ${this.score} sur ${this.sentences.length} points. Continue comme ça !`;
      } else {
        this.feedback = `Tu as obtenu ${this.score} sur ${this.sentences.length} points. Continue à t'entraîner !`;
      }
    } else {
      this.feedback = "Jeu terminé ! Continue à t'entraîner.";
    }
  }
  
  restartGame(): void {
    this.startGame();
  }
}