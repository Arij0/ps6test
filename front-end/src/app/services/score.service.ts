import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private score: number = 0;
  private totalQuestions = 0;

  constructor() {}

  // Remettre le score à zéro
  resetScore() {
    this.score = 0;
  }

  // Ajouter un point
  incrementScore() {
    this.score++;
  }

  // Obtenir le score actuel
  getScore(): number {
    return this.score;
  }

  // Si tu veux pouvoir définir un score directement
  setScore(value: number) {
    this.score = value;
  }

  getTotalQuestions() {
    return this.totalQuestions;
  }
  
  setTotalQuestions(total: number) {
    this.totalQuestions = total;
  }
}
