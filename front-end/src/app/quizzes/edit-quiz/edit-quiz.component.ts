import { Component, Input } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from 'src/models/quiz.model';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent {
  @Input() quiz!: Quiz;

  constructor(private quizService: QuizService) {}

  updateQuiz() {
    this.quizService.updateQuiz(this.quiz);
  }
}
