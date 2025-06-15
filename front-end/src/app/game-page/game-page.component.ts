import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { ScoreService } from '../services/score.service';
import { GameSettingsService } from '../services/game-settings.service';
import { SettingsService,AppSettings } from '../services/settings.service';
import { Subscription,combineLatest } from 'rxjs';
import { Question } from 'src/models/questions.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
  // Subscriptions management
  private subscriptions = new Subscription();
  private settingsSubscription!: Subscription;
  private timerInterval: any;

  // Game state
  currentQuestionIndex = 0;
  currentQuestion: Question = {} as Question;
  questions: Question[] = [];
  displayOptions: string[] = [];
  
  // Attempt tracking
  attemptCount = 0;
  maxAttempts = 2;
  removedOptions: string[] = [];
  secondChanceMode = false;
  incorrectAnswerMode = false;

  // Game settings
  gameSettings!: AppSettings
  secondChanceEnabled = true;
  removeWrongOption = true;
  showEncouragementOnSecondTry = true;
  hideWrongAnswers = true;

  // Hints system
  hintsToshow = 1;
  hintsUsed = 0;
  currentHint = '';
  currentHintIndex = 0;
  hintVisible = false;

  // Timer system
  isTimerEnabled = false;
  timerDuration = 60;
  timeLeft = 0;
  timerProgress = 100;

  // UI feedback
  feedbackMessage = '';
  feedbackExiting = false;
  showFeedback: boolean = false;

  // Theme system
  themeId: string | null = null;
  quizId: number | null = null;
  themeStyle: any = {};
  themeStyles: { [key: string]: any } = {
    princess: {
      name: 'princess',
      backgroundColor: '#f8bbd0',
      textColor: '#d81b60',
      buttonColor: '#e91e63',
      backgroundImage: 'url(assets/images/princess-bg.jpg)'
    },
    cars: {
      name: 'cars',
      backgroundColor: '#bbdefb',
      textColor: '#1e88e5',
      buttonColor: '#2196f3',
      backgroundImage: 'url(assets/images/cars-bg.jpg)'
    },
    ocean: {
      name: 'ocean',
      backgroundColor: '#b2ebf2',
      textColor: '#0097a7',
      buttonColor: '#009688',
      backgroundImage: 'url(assets/images/ocean-bg.jpg)'
    },
    space: {
      name: 'space',
      backgroundColor: '#d1c4e9',
      textColor: '#5e35b1',
      buttonColor: '#673ab7',
      backgroundImage: 'url(assets/images/space-bg.jpg)'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private scoreService: ScoreService,
    private settingsService: SettingsService,
    private gameSettingsService: GameSettingsService
  ) {
    this.initializeServices();
  }

 ngOnInit(): void {
  // Option 1 (Recommandée pour une meilleure synchronisation) :
  // Utilisez combineLatest pour attendre à la fois les paramètres de la route et les paramètres du jeu
  this.subscriptions.add(
    combineLatest([
      this.route.params, // Observable qui émet les paramètres de la route (y compris quizId)
      this.settingsService.settings$ // Observable qui émet les paramètres du jeu
    ]).subscribe(([params, settings]) => {
      // Les deux observables ont émis au moins une valeur
      this.quizId = +params['quizId']; // Récupère l'ID du quiz de la route
      this.themeId = params['themeId']; // Récupère l'ID du thème
      this.gameSettings = settings;     // Récupère les paramètres du jeu

      // Appliquez les réglages locaux du composant
      this.isTimerEnabled = settings.timerEnabled;
      this.timerDuration = settings.timerDuration;
      // Mettez à jour d'autres propriétés du GamePageComponent si elles dépendent de gameSettings
      this.secondChanceEnabled = settings.secondChanceEnabled;
      this.maxAttempts = settings.maxAttempts; // Assurez-vous que votre settings.maxAttempts existe
      this.removeWrongOption = settings.removeWrongOption;
      this.showEncouragementOnSecondTry = settings.showEncouragementOnSecondTry;
      this.hideWrongAnswers = settings.hideWrongAnswers;

      // Appliquez les styles et démarrez le timer
      this.setThemeStyle();
      this.applySettings(); // Cette méthode s'occupe du timer

      // MAINTENANT, et seulement maintenant, nous chargeons les questions
      // car nous avons toutes les informations nécessaires (quizId et gameSettings)
      this.loadQuestions();
    })
  );

  // Supprimez les appels directs à `subscribeToRouteParams()` et `subscribeToSettings()` d'ici
  // La logique combinée dans le `combineLatest` les remplace.
  // Vous pouvez supprimer les méthodes subscribeToRouteParams() et subscribeToSettings() après les avoir refactorisées ici.
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    this.stopTimer();
  }

  // Initialization methods
  private initializeServices(): void {
    if (this.gameSettingsService) {
      this.subscriptions.add(
        this.gameSettingsService.hintsToShow$.subscribe(hints => {
          this.hintsToshow = hints;
        })
      );
      this.subscriptions.add(
        this.gameSettingsService.hideWrongAnswers$.subscribe(hideWrong => {
          this.hideWrongAnswers = hideWrong;
        })
      );
    }
  }

  private subscribeToRouteParams(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.themeId = params['themeId'];
        this.quizId = +params['quizId'];
        this.setThemeStyle();
        this.loadQuestions();
      })
    );
  }

  private subscribeToSettings(): void {
    if (this.settingsService) {
      this.settingsSubscription = this.settingsService.settings$.subscribe(settings => {
        this.gameSettings = settings;
        this.isTimerEnabled = settings.timerEnabled;
        this.timerDuration = settings.timerDuration;
        this.applySettings();
      });
    }
  }

  private setThemeStyle(): void {
    this.themeStyle = this.themeId ? (this.themeStyles[this.themeId] || {}) : {};
  }

  private loadQuestions(): void {
  if (!this.quizId) {
    console.error('Erreur: ID du quiz manquant pour charger les questions.');
    return;
  }
  if (!this.gameSettings) {
    console.error('Erreur: Paramètres de jeu non chargés. Attendez que settingsService émette.');
    return; // Ne pas charger si les paramètres ne sont pas encore là
  }

  // 1. Extraire la difficulté
  const difficulty = this.gameSettings.difficulty || 'medium';

  // 2. Extraire les paramètres de longueur de mot
  let wordLength: number | undefined = undefined;
  let minWordLength: number | undefined = undefined;
  let maxWordLength: number | undefined = undefined;

  if (this.gameSettings.wordLength) { // Si le filtrage par longueur de mot est activé
    if (this.gameSettings.wordLengthRange === 'specific' && this.gameSettings.selectedWordLength) {
      wordLength = this.gameSettings.selectedWordLength;
    } else if (this.gameSettings.wordLengthRange === 'range') {
      minWordLength = this.gameSettings.customMinWordLength || undefined;
      maxWordLength = this.gameSettings.customMaxWordLength || undefined;
    }
  }

  // 3. Appel au QuestionService avec les filtres
  this.subscriptions.add(
    // Adaptez cet appel pour correspondre à la signature de votre questionService.retrieveQuestions
    // QUE NOUS AVONS MODIFIÉE DANS LE MESSAGE PRÉCÉDENT !
    this.questionService.retrieveQuestions(this.quizId, difficulty, wordLength, minWordLength, maxWordLength).pipe(
      take(1) // Prend la première émission et se désabonne
    ).subscribe({
      next: (questions) => {
        this.questions = questions;
        if (this.questions.length > 0) {
          this.initializeFirstQuestion();
        } else {
          console.warn('Aucune question trouvée pour ce quiz avec les filtres spécifiés.');
          this.feedbackMessage = 'Aucune question trouvée avec ces paramètres de jeu.';
          this.showFeedback = true; // Assurez-vous que showFeedback est géré dans votre template
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des questions:', error);
        this.feedbackMessage = 'Erreur lors du chargement des questions. Veuillez réessayer.';
        this.showFeedback = true;
      }
    })
  );
}

  private initializeFirstQuestion(): void {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.displayOptions = [...this.currentQuestion.options];
    this.scoreService.setTotalQuestions(this.questions.length);
  }

  // Timer methods
  private applySettings(): void {
  // Mettre à jour les propriétés du composant basées sur gameSettings
  if (this.gameSettings) { // Vérifiez que gameSettings est disponible
    this.isTimerEnabled = this.gameSettings.timerEnabled;
    this.timerDuration = this.gameSettings.timerDuration;
    this.hintsToshow = this.gameSettings.hintsPerExercise; // Utilisez hintsPerExercise du SettingsService
    this.hideWrongAnswers = this.gameSettings.hideWrongAnswers; // Utilisez hideWrongAnswers du SettingsService

    this.secondChanceEnabled = this.gameSettings.secondChanceEnabled;
    this.maxAttempts = this.gameSettings.maxAttempts;
    this.removeWrongOption = this.gameSettings.removeWrongOption;
    this.showEncouragementOnSecondTry = this.gameSettings.showEncouragementOnSecondTry;

    // Redémarrez le timer si nécessaire
    this.stopTimer();
    if (this.isTimerEnabled && this.timerDuration > 0) {
      this.startTimer();
    } else {
      this.timerProgress = 100;
      this.timeLeft = 0;
    }
  }
}

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private startTimer(): void {
    this.stopTimer();
    if (!this.isTimerEnabled || this.timerDuration <= 0) {
      this.timerProgress = 100;
      this.timeLeft = 0;
      return;
    }

    this.timeLeft = this.timerDuration;
    const intervalTime = 1000;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timerProgress = (this.timeLeft / this.timerDuration) * 100;
      } else {
        this.handleTimeUp();
      }
    }, intervalTime);
  }

  private handleTimeUp(): void {
    this.stopTimer();
    this.nextQuestion();
  }
  canShowHintAfterError = false;
  // Hint methods
  showHint(): void {
    if (this.canShowHint()) {
      this.hintVisible = true;
      this.currentHint = this.currentQuestion.hints[this.currentHintIndex];
      this.currentHintIndex++;
      this.hintsUsed++;
      if (this.canShowHintAfterError) {
      this.canShowHintAfterError = false;
    }
    } else {
      console.log("Vous avez utilisé tous vos indices pour cette question.");
    }
  }

  private canShowHint(): boolean {
    const hasHintsAvailable = this.currentQuestion.hints && 
                           this.currentHintIndex < this.currentQuestion.hints.length;
  const hasHintsRemaining = this.hintsUsed < this.hintsToshow;
  
  // Permettre un indice supplémentaire après une erreur si autorisé par les paramètres
  const canShowAfterError = this.canShowHintAfterError && 
                           this.gameSettings.autoHintOnSecondTry && 
                           hasHintsAvailable;
  
  return (hasHintsRemaining && hasHintsAvailable) || canShowAfterError;
  }
  private showAutomaticHint(): void {
    if (this.currentQuestion.hints && this.currentHintIndex < this.currentQuestion.hints.length) {
      this.hintVisible = true;
      this.currentHint = "💡 " + this.currentQuestion.hints[this.currentHintIndex];
      this.currentHintIndex++;
      this.hintsUsed++;
    }
  }

  // Answer checking methods
  checkAnswer(option: string): void {
    this.attemptCount++;

    if (option === this.currentQuestion.answer) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer(option);
    }
  }

  private handleCorrectAnswer(): void {
    this.scoreService.incrementScore();
    this.feedbackMessage = this.secondChanceMode ? 
      "Bravo ! Tu as trouvé la bonne réponse ! 🌟✨" : 
      this.getPositiveFeedback();

    this.showFeedbackAndProceed(() => this.nextQuestion());
  }

 private handleIncorrectAnswer(wrongOption: string): void {
  // ... votre logique existante ...

  // Si on est en seconde chance
  if (this.canGiveSecondChance()) {
    // Vérifiez si l'option d'indice supplémentaire après erreur est activée
    if (this.gameSettings.allowExtraHintAfterError && this.currentQuestion.hints &&
        this.hintsUsed < this.gameSettings.hintsPerExercise) { // Utilisez gameSettings.hintsPerExercise
      this.canShowHintAfterError = true; // Active le flag pour montrer la suggestion d'indice
      // Ici, vous pourriez déclencher showHintSuggestion() directement ou après un délai
      if (this.gameSettings.showHintSuggestionAfterError) {
        setTimeout(() => this.showHintSuggestion(), this.gameSettings.hintSuggestionDelay * 1000);
      }
    }

    // Si autoHintOnSecondTry est activé, affichez l'indice automatiquement
    if (this.gameSettings.autoHintOnSecondTry && this.currentQuestion.hints &&
        this.hintsUsed < this.gameSettings.hintsPerExercise) {
      this.showAutomaticHint(); // Appelle votre méthode pour afficher l'indice auto
    }

    this.handleSecondChance(wrongOption);
  } else {
    this.handleFinalWrongAnswer();
  }
}

  private canGiveSecondChance(): boolean {
    return this.attemptCount < this.maxAttempts && this.secondChanceEnabled;
  }

  private handleSecondChance(wrongOption: string): void {
    this.secondChanceMode = true;
    this.feedbackMessage = this.getSecondChanceFeedback();

    if (this.removeWrongOption) {
      this.removedOptions.push(wrongOption);
      this.displayOptions = this.displayOptions.filter(opt => opt !== wrongOption);
    }
    this.showFeedbackAndProceed(() => {
    
  });
  
  }

  private handleFinalWrongAnswer(): void {
    this.feedbackMessage = this.getEncouragingFeedback();
    
    this.showFeedbackAndProceed(() => {
      if (this.hideWrongAnswers) {
        this.incorrectAnswerMode = true;
        this.displayOptions = [this.currentQuestion.answer];
      } else {
        this.nextQuestion();
      }
    });
  }
  private showHintSuggestion(): void {
  if (this.canShowHintAfterError && this.currentQuestion.hints) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'hint-suggestion';
    suggestionDiv.innerHTML = '💡 Besoin d\'aide ? Clique sur le bouton indice !';
    suggestionDiv.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff9800;
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      z-index: 1000;
      animation: pulse 2s infinite;
      cursor: pointer;
    `;
    
    // Ajouter l'animation pulse via CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    suggestionDiv.onclick = () => {
      this.showHint();
      suggestionDiv.remove();
      style.remove();
    };
    
    document.body.appendChild(suggestionDiv);
    
    // Supprimer automatiquement après 10 secondes
    setTimeout(() => {
      if (suggestionDiv.parentNode) {
        suggestionDiv.parentNode.removeChild(suggestionDiv);
        style.remove();
      }
    }, 10000);
  }
}

  private showFeedbackAndProceed(callback: () => void): void {
    setTimeout(() => {
      this.feedbackExiting = true;
      setTimeout(() => {
        this.feedbackMessage = '';
        this.feedbackExiting = false;
        callback();
      }, 500);
    }, 1500);
  }

  // Navigation methods
  nextQuestion(): void {
    this.stopTimer();
    this.resetQuestionState();

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.moveToNextQuestion();
    } else {
      this.finishQuiz();
    }
  }

  private resetQuestionState(): void {
    this.incorrectAnswerMode = false;
    this.secondChanceMode = false;
    this.hintVisible = false;
    this.hintsUsed = 0;
    this.currentHintIndex = 0;
    this.attemptCount = 0;
    this.removedOptions = [];
    this.timerProgress = 100;
    this.canShowHintAfterError = false;
  }
  private showDelayedHintSuggestion(): void {
  if (this.canShowHintAfterError) {
    setTimeout(() => {
      this.showHintSuggestion();
    }, 3000); // Attendre 3 secondes après l'encouragement
  }
}

  private moveToNextQuestion(): void {
    this.currentQuestionIndex++;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.displayOptions = [...this.currentQuestion.options];
    this.applySettings();
  }

  finishQuiz(): void {
    this.stopTimer();
    this.router.navigate(['/quiz-end'], {
      state: {
        totalQuestions: this.questions.length,
        theme: this.themeStyle
      }
    });
  }

  // Feedback message generators
  private getPositiveFeedback(): string {
    const messages = [
      "Bravo ! Continue comme ça ! 💪",
      "Super réponse ! 🚀",
      "Tu es incroyable ! ✨",
      "Génial ! Garde le rythme ! 🔥"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getEncouragingFeedback(): string {
    const messages = [
      "Oups, ce n'était pas la bonne réponse ! Reste concentré, tu peux le faire ! 🌟",
      "Pas grave, c'était une mauvaise réponse ! Continue, tu es sur la bonne voie ! 🚀",
      "Ce n'était pas la bonne réponse, mais ton effort compte ! Garde confiance ! ✨",
      "Essaie encore, tu es capable ! 💪"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getSecondChanceFeedback(): string {
    const messages = [
      "Oups ! Essaie encore, tu peux le faire ! 💪",
      "Pas grave ! Regarde bien les autres options 👀",
      "Presque ! Réfléchis encore un peu 🤔",
      "Ce n'est pas grave, essaie une autre réponse ! 🌟"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }



  // Configuration methods
  configureSecondChance(settings: any): void {
    this.secondChanceEnabled = settings.secondChanceEnabled ?? true;
    this.maxAttempts = settings.maxAttempts ?? 2;
    this.removeWrongOption = settings.removeWrongOption ?? true;
    this.showEncouragementOnSecondTry = settings.showEncouragementOnSecondTry ?? true;
  }

  // Utility methods
  openSettings(): void {
    this.router.navigate(['/settings']);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}