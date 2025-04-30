import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { ScoreService } from '../services/score.service';
import { GameSettingsService } from '../services/game-settings.service';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {

  settingsForm: any;
  currentQuestionIndex = 0;  // Indice de la question en cours
  currentQuestion: any = {};  // Question actuelle
  questions: any[] = [];   // Liste de toutes les questions
  gameSettings: any = {};  // Paramètres du jeu
  private settingsSubscription!: Subscription;
  hintsToshow: number = 1;
  hintsUsed = 0; // Suivre le nombre d'indices utilisés pour la question actuelle
  currentHint: string = '';
  currentHintIndex = 0;

  timerProgress = 100;
  hintVisible = false;
  feedbackMessage = '';
  feedbackExiting = false;
  timerInterval: any;

  themeId: string | null = null;
  themeStyle: any = {};

  // Styles pour différents thèmes
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
    this.gameSettingsService.hintsToShow$.subscribe(hints => {
      this.hintsToshow = hints;
    });
  }

  ngOnInit() {
    // Récupérer l'ID du thème depuis les paramètres de la route
    this.route.params.subscribe(params => {
      const themeId = params['themeId'];
      this.themeId = themeId;
      this.themeStyle = this.themeStyles[themeId] || {};
    });

    // Charger les questions depuis le service
    this.questions = this.questionService.getQuestions();
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    // Définir le nombre total de questions
    this.scoreService.setTotalQuestions(this.questions.length);

    // Souscrire aux paramètres du jeu
    this.settingsSubscription = this.settingsService.settings$.subscribe(settings => {
      this.gameSettings = settings;
      this.applySettings();
    });
  }

  ngOnDestroy() {
    // Se désabonner des paramètres et arrêter le timer si nécessaire
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  applySettings() {
    if (this.gameSettings) {
      // Appliquer les paramètres du timer
      if (!this.gameSettings.timerEnabled) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.timerProgress = 100;
      } else {
        this.startTimer();
      }
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (this.gameSettings.timerEnabled) {
      const duration = this.gameSettings.timerDuration || 60;
      const decrementPerTick = 100 / (duration * 10); // 10 ticks par seconde

      this.timerInterval = setInterval(() => {
        if (this.timerProgress > 0) {
          this.timerProgress -= decrementPerTick;
        } else {
          this.nextQuestion();
          this.timerProgress = 100;
        }
      }, 100);
    }
  }

  showHint() {
    if (this.hintsUsed < this.hintsToshow && this.currentQuestion.hints && this.currentHintIndex < this.currentQuestion.hints.length) {
      this.hintVisible = true;
      this.currentHint = this.currentQuestion.hints[this.currentHintIndex];
      this.currentHintIndex++;
      this.hintsUsed++;
    } else {
      console.log("Vous avez utilisé tous vos indices pour cette question.");
    }
  }

  getPositiveFeedback(): string {
    const messages = [
      "Bravo ! Continue comme ça ! 💪",
      "Super réponse ! 🚀",
      "Tu es incroyable ! ✨",
      "Génial ! Garde le rythme ! 🔥"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getEncouragingFeedback(): string {
    const messages = [
      "Oups, ce n'était pas la bonne réponse ! Reste concentré, tu peux le faire ! 🌟",
      "Pas grave, c'était une mauvaise réponse ! Continue, tu es sur la bonne voie ! 🚀",
      "Ce n'était pas la bonne réponse, mais ton effort compte ! Garde confiance ! ✨",
      "Essaie encore, tu es capable ! 💪"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  checkAnswer(option: string) {
    if (option === this.currentQuestion.answer) {
      this.scoreService.incrementScore();
      this.feedbackMessage = this.getPositiveFeedback();
    } else {
      this.feedbackMessage = this.getEncouragingFeedback();
    }

    setTimeout(() => {
      this.feedbackExiting = true;

      // Attendre la fin de l'animation de sortie avant de passer à la question suivante
      setTimeout(() => {
        this.feedbackMessage = '';
        this.feedbackExiting = false;
        this.nextQuestion();
        this.timerProgress = 100;
      }, 500); // Durée de l'animation de sortie
    }, 1500);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.hintVisible = false;
      this.hintsUsed = 0;
      this.currentHintIndex = 0;
      this.timerProgress = 100; // Réinitialiser le timer pour la nouvelle question
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.router.navigate(['/quiz-end'], {
      state: {
        totalQuestions: this.questions.length,
        theme: this.themeStyle
      }
    });
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}