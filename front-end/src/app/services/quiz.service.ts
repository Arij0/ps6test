import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quiz } from 'src/models/quiz.model';
import { serverUrl, httpOptionsBase } from 'src/configs/server.config';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Question } from 'src/models/questions.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  public quizzes$ = this.quizzesSubject.asObservable();
  
  private currentQuizId: string | null = null;
  private quizzesUrl = serverUrl + '/quizzes';
  private httpOptions = httpOptionsBase;
  setCurrentQuizId(id: string): void {
    this.currentQuizId = id;
  }

  getCurrentQuizId(): string | null {
    return this.currentQuizId;
  }
  constructor(private http: HttpClient) {
    this.getQuizzes(); 
  }

  getQuizzes() {
    this.http.get<Quiz[]>(this.quizzesUrl, this.httpOptions).subscribe((quizzes) => {
      const fixedQuizzes = quizzes.map(q => ({ ...q, id: q.id?.toString() }));
      this.quizzesSubject.next(fixedQuizzes);
    });
  }

  getQuizById(id: string) {
    return this.http.get<Quiz>(`${this.quizzesUrl}/${id}`, this.httpOptions);
  }

  addQuiz(newQuiz: Omit<Quiz, 'id' | 'questions'>) {
    return this.http.post<Quiz>(this.quizzesUrl, newQuiz, this.httpOptions).pipe(
      tap((created) => {
        const quizWithStringId = { ...created, id: created.id?.toString() };
        const current = this.quizzesSubject.getValue();
        this.quizzesSubject.next([...current, quizWithStringId]);
      })
    );
  }

  updateQuiz(updatedQuiz: Quiz) {
    return this.http.put<Quiz>(`${this.quizzesUrl}/${updatedQuiz.id}`, updatedQuiz, this.httpOptions);
  }

  deleteQuiz(id: string) {
    return this.http.delete(`${this.quizzesUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        const remaining = this.quizzesSubject.getValue().filter(q => q.id !== id);
        this.quizzesSubject.next(remaining);
      })
    );
  }
addQuestion(quizId: number, question: Question) {
  return this.http.post(`${this.quizzesUrl}/${quizId}/questions`, question, this.httpOptions);
}



}
