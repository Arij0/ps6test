import { Component, Input } from '@angular/core';
import { Quiz } from 'src/models/quiz.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  @Input() quiz!: Quiz;
}
