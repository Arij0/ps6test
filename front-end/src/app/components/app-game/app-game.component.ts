import { Component, OnInit, OnDestroy } from '@angular/core';

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
  totalQuestions: number = 5;
  currentQuestionIndex: number = 0;
  
  // Gestion du temps
  timeLeft: number = 60; // 60 secondes par défaut
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
  
  constructor() { }
  
  ngOnInit(): void {
    this.startGame();
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
  }
  
  startGame(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.timeExpired = false;
    this.loadQuestion();
    this.startTimer();
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
  
  checkAnswer(): void {
    if (this.userAnswer === this.correctWord) {
      this.score++;
    }
    
    this.currentQuestionIndex++;
    this.userAnswer = '';
    
    if (this.currentQuestionIndex < this.sentences.length) {
      this.loadQuestion();
    } else {
      this.finishGame();
    }
  }
  
  startTimer(): void {
    this.stopTimer(); // Arrêter le timer précédent s'il existe
    this.timeLeft = this.maxTime;
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      
      if (this.timeLeft <= 0) {
        this.timeExpired = true;
        this.stopTimer();
        this.showEncouragementMessage();
      }
    }, 1000);
  }
  
  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  showEncouragementMessage(): void {
    // Choisir un message aléatoire
    const randomIndex = Math.floor(Math.random() * this.encouragementMessages.length);
    this.currentMessage = this.encouragementMessages[randomIndex];
  }
  
  finishGame(): void {
    this.stopTimer();
    // Afficher les résultats ou rediriger vers une page de résultats
  }
  
  restartGame(): void {
    this.startGame();
  }
  
  getTimePercentage(): number {
    return (this.timeLeft / this.maxTime) * 100;
  }
  
  selectWord(word: string): void {
    this.userAnswer = word;
  }
  
  submitAnswer(): void {
    this.checkAnswer();
  }
}