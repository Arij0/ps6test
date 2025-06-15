import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from 'src/models/quiz.model';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  themeId!: string;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizService.quizzes$.subscribe(quizzes => {
      this.quizzes = quizzes;
      this.themeId = this.route.snapshot.paramMap.get('themeId')!;
    });
  }

startQuiz(quizId?: string) {
    if (!quizId) {
      console.warn('Cannot start quiz: quizId is undefined.');
      return;
    }

    const themeId = this.themeId; // Ensure themeId is available

    if (!themeId) {
      console.error('Cannot start quiz: themeId is undefined. Please ensure theme is selected or loaded correctly.');
      // Handle this error, e.g., redirect to theme selection
      // this.router.navigate(['/themes']);
      return;
    }

    // --- IMPORTANT: ADD THESE LINES ---
    this.quizService.setCurrentQuizId(quizId); // Set the current quiz ID in the service
    this.themeService.setCurrentThemeId(themeId); // Set the current theme ID in the service
    console.log(`QuizListComponent: Setting currentQuizId to ${quizId} and currentThemeId to ${themeId}`);
    // --- END IMPORTANT ADDITION ---

    this.router.navigate(['/game', quizId, themeId]);
  }


  createNewQuiz(): void {
    this.router.navigate(['/create-quiz']);
  }
}
