import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreService } from '../services/score.service';


@Component({
  selector: 'app-quiz-end',
  templateUrl: './quiz-end-page.component.html',
  styleUrls: ['./quiz-end-page.component.scss']
})
export class QuizEndComponent implements OnInit {
  score: number = 0;
  totalQuestions: number = 0;

  constructor(private router: Router,
    private scoreService: ScoreService
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      
      totalQuestions: number;
    };
  
   
    
      
    this.totalQuestions = this.scoreService.getTotalQuestions();
    
    this.score = this.scoreService.getScore();

  }

  restartQuiz() {
    this.scoreService.resetScore(); 
    this.router.navigate(['/themes']);
  }

  goToNextQuiz() {
    this.router.navigate(['themes']); 
  }

  getMotivationalMessage(): string {
    const percentage = (this.score / this.totalQuestions) * 100;

    if (percentage === 100) {
      return 'Bravo, tu as tout parfait ! 🎉';
    } else if (percentage >= 80) {
      return 'Super ! Tu as bien réussi. 🎯';
    } else if (percentage >= 50) {
      return 'Pas mal, continue à t’entraîner ! 💪';
    } else {
      return 'N’abandonne pas, tu vas y arriver ! 🔥';
    }
  }
}
