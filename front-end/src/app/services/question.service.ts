import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { BehaviorSubject, from } from 'rxjs';
import { Question } from 'src/models/questions.model';
import { serverUrl, httpOptionsBase } from 'src/configs/server.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

interface QuestionFilterParams {
  difficulty?: string;
  minWordLength?: number;
  maxWordLength?: number;
  allowedWordLengths?: number[];
  includeSimilarLetters?: boolean;
  phoneticComplexityLevel?: number;
  // Flags pour activer les filtres
  wordLength?: boolean;
  similarLetters?: boolean;
  phoneticComplexity?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable();

  private questionsUrl = `${serverUrl}/quizzes`;
  private httpOptions = httpOptionsBase;
  private defaultQuestions: Question[] = [];

  private similarLetterGroups = [
    ['b', 'd'],
    ['p', 'q'],
    ['m', 'n'],
    ['v', 'w'],
    ['i', 'j', 'l'],
    ['a', 'e', 'o']
  ];

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient
  ) {}

  /**
   * Méthode principale pour récupérer les questions avec filtrage
   */
 retrieveQuestions(quizId: number, filterParams?: QuestionFilterParams): Observable<Question[]> {
  const url = `${this.questionsUrl}/${quizId}/questions`;

  console.log('[DEBUG] URL appelée:', url);
  console.log('[DEBUG] Paramètres de filtrage:', filterParams);

  // Construire les paramètres de requête
  let params = new HttpParams();
  if (filterParams) {
    console.log('[QuestionService] Paramètres de filtrage reçus:', filterParams);

    // Difficulté
    if (filterParams.difficulty) {
      params = params.set('difficulty', filterParams.difficulty);
    }

    // Filtrage par longueur de mot - CORRECTION ICI
    if (filterParams.wordLength === true) {
      // Si allowedWordLengths est défini, l'utiliser en priorité
      if (filterParams.allowedWordLengths && filterParams.allowedWordLengths.length > 0) {
        params = params.set('allowedWordLengths', filterParams.allowedWordLengths.join(','));
      }
      // Sinon utiliser min/max
      else if (filterParams.minWordLength !== undefined && filterParams.maxWordLength !== undefined) {
        params = params.set('minWordLength', filterParams.minWordLength.toString());
        params = params.set('maxWordLength', filterParams.maxWordLength.toString());
      }
    }

    // Filtrage par lettres similaires
    if (filterParams.similarLetters === true && filterParams.includeSimilarLetters !== undefined) {
      params = params.set('includeSimilarLetters', filterParams.includeSimilarLetters.toString());
    }

    // Filtrage par complexité phonétique
    if (filterParams.phoneticComplexity === true && filterParams.phoneticComplexityLevel !== undefined) {
      params = params.set('phoneticComplexityLevel', filterParams.phoneticComplexityLevel.toString());
    }
  }

  console.log('[DEBUG] Paramètres HTTP finaux:', params.toString());
  console.log('[DEBUG] URL complète:', `${url}?${params.toString()}`);

  return this.http.get<any>(url, { params }).pipe(
    tap(response => {
      console.log('[DEBUG] Réponse brute du backend:', response);
    }),
    map(response => {
      console.log('[QuestionService] Réponse brute du backend:', response);
      
      // Gérer différents formats de réponse
      let questions: Question[] = [];
      if (response) {
        if (Array.isArray(response)) {
          questions = response;
        } else if (response.questions && Array.isArray(response.questions)) {
          questions = response.questions;
        } else if (response.data && Array.isArray(response.data)) {
          questions = response.data;
        }
      }

      // S'assurer que les questions ont les propriétés nécessaires
      questions = questions.map(q => this.normalizeQuestion(q));
      console.log('[QuestionService] Questions normalisées:', questions.length);
      return questions;
    }),
    tap(questions => {
      console.log('[QuestionService] Questions mises à jour dans le BehaviorSubject:', questions.length);
      this.questionsSubject.next(questions);
    }),
    catchError(err => {
      console.error('[QuestionService] Erreur lors de la récupération des questions:', err);
      console.log('[QuestionService] Utilisation des questions par défaut');
      this.questionsSubject.next(this.defaultQuestions);
      return of(this.defaultQuestions);
    })
  );
}

  /**
   * Méthode helper pour convertir les settings du GameSettingsComponent en paramètres de filtrage
   */
 retrieveQuestionsWithSettings(quizId: number, settings: any): Observable<Question[]> {
  console.log('[QuestionService] Settings reçus:', settings);
  
  const filterParams: QuestionFilterParams = {
    difficulty: settings.difficulty,
    wordLength: settings.wordLength === true,
    similarLetters: settings.similarLetters === true,
    phoneticComplexity: settings.phoneticComplexity === true
  };

  // Configuration de la longueur des mots
  if (filterParams.wordLength) {
    if (settings.allowedWordLengths && settings.allowedWordLengths.length > 0) {
      filterParams.allowedWordLengths = settings.allowedWordLengths;
    } else {
      filterParams.minWordLength = settings.minWordLength;
      filterParams.maxWordLength = settings.maxWordLength;
    }
  }

  // Configuration des lettres similaires
  if (filterParams.similarLetters) {
    filterParams.includeSimilarLetters = settings.includeSimilarLetters;
  }

  // Configuration de la complexité phonétique
  if (filterParams.phoneticComplexity) {
    filterParams.phoneticComplexityLevel = settings.phoneticComplexityLevel;
  }

  console.log('[QuestionService] Paramètres de filtrage générés:', filterParams);
  return this.retrieveQuestions(quizId, filterParams);
}

  /**
   * Version simplifiée pour compatibilité descendante (obsolète mais maintenue)
   */
  retrieveQuestionsSimple(quizId: number, difficulty?: string, wordLength?: number): Observable<Question[]> {
    const filterParams: QuestionFilterParams = {};
    
    if (difficulty) {
      filterParams.difficulty = difficulty;
    }
    
    if (wordLength) {
      filterParams.wordLength = true;
      filterParams.minWordLength = wordLength;
      filterParams.maxWordLength = wordLength;
    }
    
    return this.retrieveQuestions(quizId, filterParams);
  }

  /**
   * Normalise une question pour s'assurer qu'elle a toutes les propriétés nécessaires
   */
  private normalizeQuestion(question: any): Question {
    return {
      id: question.id,
      text: question.text,
      options: question.options || [],
      answer: question.answer,
      hints: question.hints || [],
      wordLength: question.wordLength || this.calculateWordLength(question.answer),
      hasSimilarLetters: question.hasSimilarLetters !== undefined ? 
        question.hasSimilarLetters : this.checkForSimilarLetters(question.answer || ''),
      phoneticComplexity: question.phoneticComplexity || 
        this.determinePhoneticComplexity(question.answer || ''),
      isCustom: question.isCustom || false,
      category: question.category
    };
  }

  /**
   * Calcule la longueur du mot à partir de la réponse
   */
  private calculateWordLength(answer: string): number {
    return answer ? answer.length : 0;
  }

  /**
   * Vérifie si un mot contient des lettres similaires
   */
  private checkForSimilarLetters(word: string): boolean {
    if (!word) return false;
    
    const lowerWord = word.toLowerCase();
    for (const group of this.similarLetterGroups) {
      const lettersInWord = group.filter(letter => lowerWord.includes(letter));
      if (lettersInWord.length > 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Détermine la complexité phonétique d'un mot
   */
  private determinePhoneticComplexity(word: string): number {
    if (!word) return 1;
    
    const lowerWord = word.toLowerCase();
    if (this.hasComplexPatterns(lowerWord)) {
      return 3;
    } else if (this.hasMediumPatterns(lowerWord)) {
      return 2;
    }
    return 1;
  }

  private hasComplexPatterns(word: string): boolean {
    const complexPatterns = ['ph', 'ch', 'gn', 'qu', 'ille', 'euil', 'ail', 'rh', 'th', 'x', 'y'];
    return complexPatterns.some(pattern => word.includes(pattern));
  }

  private hasMediumPatterns(word: string): boolean {
    const mediumPatterns = ['ou', 'on', 'in', 'an', 'en', 'ai', 'ei', 'au', 'eu', 'oi', 'ui', 'ue'];
    return mediumPatterns.some(pattern => word.includes(pattern));
  }

  // ========================
  // MÉTHODES CORRIGÉES POUR LES QUESTIONS PERSONNALISÉES
  // ========================

  /**
   * Ajoute une question personnalisée - CORRIGÉ pour retourner un Observable
   */
  addQuestion(quizId: number, question: Question): Observable<Question> {
    question.isCustom = true;
    question = this.normalizeQuestion(question);
    const url = `${this.questionsUrl}/${quizId}/questions`;
    
    return this.http.post<Question>(url, question, this.httpOptions).pipe(
      tap(() => {
        console.log('[QuestionService] Question ajoutée avec succès');
        // Rafraîchir les questions après ajout
        this.retrieveQuestions(quizId).subscribe();
      }),
      catchError(err => {
        console.error('[QuestionService] Erreur ajout question:', err);
        throw err;
      })
    );
  }

  /**
   * Ajoute plusieurs questions personnalisées - CORRIGÉ pour retourner un Observable
   */
  addQuestions(quizId: number, questions: Question[]): Observable<any> {
    const normalizedQuestions = questions.map(q => {
      q.isCustom = true;
      return this.normalizeQuestion(q);
    });
    
    const url = `${this.questionsUrl}/${quizId}/questions/batch`;
    
    return this.http.post(url, normalizedQuestions, this.httpOptions).pipe(
      tap(() => {
        console.log('[QuestionService] Questions ajoutées en lot avec succès');
        // Rafraîchir les questions après ajout
        this.retrieveQuestions(quizId).subscribe();
      }),
      catchError(err => {
        console.error('[QuestionService] Erreur ajout questions en lot:', err);
        throw err;
      })
    );
  }

  /**
   * Supprime une question - CORRIGÉ pour retourner un Observable
   */
  deleteQuestion(quizId: number, questionId: string): Observable<any> {
    const url = `${this.questionsUrl}/${quizId}/questions/${questionId}`;
    
    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => {
        console.log('[QuestionService] Question supprimée avec succès');
        this.retrieveQuestions(quizId).subscribe();
      }),
      catchError(err => {
        console.error('[QuestionService] Erreur suppression question:', err);
        throw err;
      })
    );
  }

  /**
   * Met à jour une question - CORRIGÉ pour retourner un Observable
   */
  updateQuestion(quizId: number, question: Question): Observable<any> {
    question = this.normalizeQuestion(question);
    const url = `${this.questionsUrl}/${quizId}/questions/${question.id}`;
    
    return this.http.put(url, question, this.httpOptions).pipe(
      tap(() => {
        console.log('[QuestionService] Question mise à jour avec succès');
        this.retrieveQuestions(quizId).subscribe();
      }),
      catchError(err => {
        console.error('[QuestionService] Erreur mise à jour question:', err);
        throw err;
      })
    );
  }

  /**
   * Méthode de filtrage côté client (en cas de problème avec le backend)
   */
  filterQuestionsLocally(questions: Question[], filterParams: QuestionFilterParams): Question[] {
    return questions.filter(question => {
      // Filtrage par longueur de mot
      if (filterParams.wordLength) {
        if (filterParams.allowedWordLengths && filterParams.allowedWordLengths.length > 0) {
          if (!filterParams.allowedWordLengths.includes(question.wordLength)) {
            return false;
          }
        } else if (filterParams.minWordLength !== undefined && filterParams.maxWordLength !== undefined) {
          if (question.wordLength < filterParams.minWordLength || 
              question.wordLength > filterParams.maxWordLength) {
            return false;
          }
        }
      }

      // Filtrage par lettres similaires
      if (filterParams.similarLetters && filterParams.includeSimilarLetters !== undefined) {
        if (filterParams.includeSimilarLetters && !question.hasSimilarLetters) {
          return false;
        }
        if (!filterParams.includeSimilarLetters && question.hasSimilarLetters) {
          return false;
        }
      }

      // Filtrage par complexité phonétique
      if (filterParams.phoneticComplexity && filterParams.phoneticComplexityLevel !== undefined) {
        if (question.phoneticComplexity > filterParams.phoneticComplexityLevel) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Méthode de test pour le filtrage côté client
   */
  testLocalFiltering(quizId: number, filterParams: QuestionFilterParams): void {
    // Récupérer toutes les questions d'abord
    this.http.get<any>(`${this.questionsUrl}/${quizId}/questions`).subscribe(response => {
      let allQuestions: Question[] = [];
      if (Array.isArray(response)) {
        allQuestions = response.map(q => this.normalizeQuestion(q));
      }
      
      console.log('[DEBUG] Toutes les questions avant filtrage:', allQuestions.length);
      
      // Appliquer le filtrage côté client
      const filteredQuestions = this.filterQuestionsLocally(allQuestions, filterParams);
      console.log('[DEBUG] Questions après filtrage local:', filteredQuestions.length);
      console.log('[DEBUG] Questions filtrées:', filteredQuestions);
    });
  }

  // ========================
  // MÉTHODES UTILITAIRES PUBLIQUES
  // ========================

  /**
   * Récupère les questions actuelles du BehaviorSubject
   */
  getCurrentQuestions(): Question[] {
    return this.questionsSubject.value;
  }

  /**
   * Récupère le nombre de questions actuelles
   */
  getQuestionsCount(): number {
    return this.questionsSubject.value.length;
  }

  /**
   * Réinitialise les questions
   */
  resetQuestions(): void {
    this.questionsSubject.next([]);
  }

  /**
   * Met à jour manuellement les questions dans le BehaviorSubject
   */
  updateQuestionsSubject(questions: Question[]): void {
    this.questionsSubject.next(questions);
  }
}