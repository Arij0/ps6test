import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from 'src/models/quiz.model';
import { Question } from 'src/models/questions.model';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss']
})
export class QuizFormComponent {

  Quiz: Quiz = { id: '0', title: '', description: '', category: '' ,imageUrl:''};
  questions: any[] = [];          // ← tableau classique

  constructor(private quizService: QuizService, private router: Router) {}

  /* Ajoute un bloc question vide */
  addQuestion(): void {
    this.questions.push({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      hints: ['', '', '', '', '']
    });
  }

  removeQuestion(i: number): void {
    this.questions.splice(i, 1);
  }

  /* Soumission : quiz + batch de questions */
  addQuiz(): void {
    const { title, description, category, imageUrl} = this.Quiz;

   this.quizService.addQuiz({ title, description, category,imageUrl}).subscribe({
  next: createdQuiz => {
    const quizId = Number(createdQuiz.id);

    const formatted: Question[] = this.questions.map(q => {
    const opts = q.options.filter((o: string) => o.trim() !== '');
    const ans = opts[q.correctAnswer] || opts[0];
    return {
    text: q.text,
    options: opts,
    answer: ans,
    hints: q.hints ? q.hints.filter((h: string) => h.trim() !== '') : [],
    wordLength: ans.length,
    hasSimilarLetters: false,
    phoneticComplexity: 1,
    isCustom: true,
    quizId
  };
});


    let count = 0;
    formatted.forEach(q => {
      this.quizService.addQuestion(quizId,q).subscribe({
        next: () => {
          count++;
          if (count === formatted.length) {
            alert('Quiz et questions ajoutés ✔');
            this.router.navigate(['quiz-list/:themeId']);
          }
        },
        error: err => console.error('Erreur ajout question :', err)
      });
    });
  },
  error: err => console.error('Erreur création quiz :', err)
});  
  }

  imagePreview: string | null = null;

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.Quiz.imageUrl = this.imagePreview; // injecte le base64 dans le quiz
    };

    reader.readAsDataURL(file);
  }
}
//To fix Dom problem pour que le curseur reste où on tape
trackByIndex(index: number): number {
  return index;
}


}
