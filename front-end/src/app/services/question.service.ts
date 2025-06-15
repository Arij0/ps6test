import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { BehaviorSubject, from } from 'rxjs';
import { Question } from 'src/models/questions.model';
import { serverUrl, httpOptionsBase } from 'src/configs/server.config';
import { HttpClient,HttpParams} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable();
  //private questionsUrl = serverUrl + '/questions';

  private questionsUrl = `${serverUrl}/quizzes`;
  private httpOptions = httpOptionsBase;
  private defaultQuestions : Question[] = [

    

    /*{
      text: "Le _____ est un animal qui miaule et aime les souris.",
      options: ["Chat", "Chien", "Oiseau", "Poisson"],
      answer: "Chat",
      hints: ["Il aime la souris !", "Il ronronne souvent.", "C'est un félin.", "Il a des moustaches.", "Il aime dormir au soleil."],
      wordLength: 4,
      hasSimilarLetters: false,
      phoneticComplexity: 1,
      isCustom: false
    },
    {
      text: "Le _____ est un objet qui sert à naviguer sur l'eau.",
      options: ["Bateau", "Voiture", "Avion", "Vélo"],
      answer: "Bateau",
      hints: ["On l'utilise pour traverser la mer !", "Il flotte.", "Il peut avoir des voiles ou un moteur.", "Il a une coque.", "On l'amarre au port."],
      wordLength: 6,
      hasSimilarLetters: true,
      phoneticComplexity: 2,
      isCustom: false
    },
    {
      text: "Une _____ est un endroit où on habite généralement.",
      options: ["Maison", "Magasin", "Musée", "Marché"],
      answer: "Maison",
      hints: ["C'est là où on dort tous les soirs !", "Elle a des murs et un toit.", "C'est un lieu de vie privé.", "Elle peut avoir un jardin.", "On y trouve des meubles."],
      wordLength: 6,
      hasSimilarLetters: true,
      phoneticComplexity: 2,
      isCustom: false
    },
    {
      text: "Les _____ sont des plantes qui poussent dans un jardin.",
      options: ["Fleurs", "Voitures", "Ordinateurs", "Chaussures"],
      answer: "Fleurs",
      hints: ["Elles sont colorées et sentent bon !", "Elles ont des pétales.", "On les offre souvent en cadeau.", "Elles ont besoin d'eau et de soleil.", "Les abeilles les aiment."],
      wordLength: 6,
      hasSimilarLetters: false,
      phoneticComplexity: 2,
      isCustom: false
    },
    {
      text: "Le _____ est un instrument de musique avec des touches noires et blanches.",
      options: ["Piano", "Table", "Crayon", "Assiette"],
      answer: "Piano",
      hints: ["Il a des touches noires et blanches !", "On en joue avec les mains.", "Il produit de la musique classique et moderne.", "Il a des pédales.", "Il peut être à queue ou droit."],
      wordLength: 5,
      hasSimilarLetters: true,
      phoneticComplexity: 2,
      isCustom: false
    },
    {
      text: "Par temps clair, le ciel est de couleur _____.",
      options: ["Rouge", "Bleu", "Vert", "Jaune"],
      answer: "Bleu",
      hints: ["C'est aussi la couleur de l'océan !", "On le regarde souvent quand il fait beau.", "C'est une couleur primaire.", "Il est parfois parsemé de nuages.", "Les oiseaux y volent."],
      wordLength: 4,
      hasSimilarLetters: false,
      phoneticComplexity: 1,
      isCustom: false
    },
    {
      text: "Le _____ est un animal qui a une corne sur le nez.",
      options: ["Rhinocéros", "Éléphant", "Girafe", "Hippopotame"],
      answer: "Rhinocéros",
      hints: ["C'est un grand animal gris avec une peau très épaisse !", "Il vit en Afrique et en Asie.", "Sa corne est faite de kératine.", "Il aime se rouler dans la boue.", "Il est herbivore."],
      wordLength: 10,
      hasSimilarLetters: true,
      phoneticComplexity: 3,
      isCustom: false
    },
    {
      text: "Le _____ est une personne qui prépare et vend des médicaments.",
      options: ["Pharmacien", "Boulanger", "Professeur", "Dentiste"],
      answer: "Pharmacien",
      hints: ["On le trouve dans une pharmacie !", "Il conseille sur les médicaments.", "Il délivre des ordonnances.", "Il porte souvent une blouse blanche.", "Il connaît les effets des médicaments."],
      wordLength: 10,
      hasSimilarLetters: true,
      phoneticComplexity: 3,
      isCustom: false
    },
    { 
      text: "Le _____ est un médecin qui opère les patients à l'hôpital.",
      options: ["Chirurgien", "Jardinier", "Pompier", "Pilote"],
      answer: "Chirurgien",
      hints: ["Il utilise des instruments pour soigner à l'intérieur du corps !", "Il travaille dans un bloc opératoire.", "C'est un spécialiste médical.", "Il porte un masque et une charlotte.", "Il est très précis dans ses gestes."],
      wordLength: 10,
      hasSimilarLetters: true,
      phoneticComplexity: 3,
      isCustom: false
    },
    {
      text: "Le _____ est un spécialiste qui soigne les problèmes mentaux.",
      options: ["Psychiatre", "Plombier", "Boucher", "Astronaute"],
      answer: "Psychiatre",
      hints: ["C'est un médecin spécialisé dans les maladies de l'esprit !", "Il peut prescrire des médicaments.", "Il mène des thérapies et des entretiens.", "Il écoute attentivement ses patients.", "Son bureau est souvent un lieu calme."],
      wordLength: 10,
      hasSimilarLetters: true,
      phoneticComplexity: 3,
      isCustom: false
    },
    {
      text: "Le _____ est un instrument en bois qui fait un son quand on le tape.",
      options: ["Xylophone", "Violon", "Trompette", "Tambour"],
      answer: "Xylophone",
      hints: ["Il a des lames de différentes tailles qu'on frappe !", "On utilise des mailloches pour en jouer.", "Il produit des sons mélodieux.", "Ses lames sont souvent en bois ou en métal.", "On le trouve parfois dans les orchestres."],
      wordLength: 9,
      hasSimilarLetters: true,
      phoneticComplexity: 3,
      isCustom: false
    }*/

  ];
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
  ) {
    // Initialiser avec les questions existantes
    //this.questionsSubject.next(this.allQuestions);
    //this.retrieveQuestions();
  }
 
   retrieveQuestions(quizId: number,
    difficulty?: string,
    wordLength?: number,
    minWordLength?: number, // <--- NOUVEAU PARAMÈTRE
    maxWordLength?: number  // <--- NOUVEAU PARAMÈTRE
  ): Observable<Question[]> {
    let params = new HttpParams(); // <-- Créer un nouvel objet HttpParams

    if (difficulty) {
      params = params.append('difficulty', difficulty); // <-- Ajouter la difficulté aux paramètres
    }
    if (wordLength !== undefined && wordLength !== null) {
      params = params.append('wordLength', wordLength.toString()); // <-- Ajouter wordLength aux paramètres
    }

    const url = `${this.questionsUrl}/${quizId}/questions`;

    // Passer les paramètres dans la requête GET
    return this.http.get<any>(url, { params }).pipe( // <- Le type de réponse peut être 'any' si vous retournez un objet avec 'success', 'questions', etc.
      tap(response => { // <- Adapter pour gérer la réponse du backend
        // Le backend retourne un objet { success: true, questions: [...] } quand filtré
        // et un tableau direct de questions quand non filtré.
        const questionsList = response.questions || response; // Prendre 'questions' si filtré, sinon la réponse entière
        this.questionsSubject.next(questionsList);
      }),
      catchError(err => {
        console.error('[QuestionService] retrieveQuestions :', err);
        this.questionsSubject.next(this.defaultQuestions); // En cas d'erreur, revenir aux questions par défaut
        return of(this.defaultQuestions);
      })
    );
  }

   
  addQuestion(quizId: number, question: Question): void {
  question.isCustom = true;

  // Assurez-vous que ces propriétés sont définies ou calculées avant d'envoyer
  // Le backend s'attend à ces valeurs.
  question.wordLength = question.text ? question.text.length : 0; // Calcul basé sur le texte
  question.hasSimilarLetters = this.checkForSimilarLetters(question.text || ''); // Utilisez votre fonction existante
  question.phoneticComplexity = question.phoneticComplexity || 0; // Assurez une valeur par défaut si non fournie

  const url = `${this.questionsUrl}/${quizId}/questions`;
  this.http.post<Question>(url, question, this.httpOptions).subscribe(
    // Après un ajout, vous pouvez appeler retrieveQuestions sans filtres pour rafraîchir toutes les questions,
    // ou avec les filtres actuels si vous souhaitez maintenir l'état filtré de l'affichage.
    () => this.retrieveQuestions(quizId).subscribe(), // Appelle la version sans filtre par défaut
    err => console.error('[QuestionService] addQuestion :', err)
  );
}
  
  // Méthode pour ajouter plusieurs questions
    addQuestions(quizId: number, questions: Question[]): void {
    questions.forEach(q => q.isCustom = true);

    const url = `${this.questionsUrl}/${quizId}/questions/batch`;
    this.http.post(url, questions, this.httpOptions).subscribe(
      () => this.retrieveQuestions(quizId).subscribe(),
      err => console.error('[QuestionService] addQuestions :', err)
    );
  }
  // Supprimer une question via l'API
  deleteQuestion(quizId: number, questionId: string): void {
    const url = `${this.questionsUrl}/${quizId}/questions/${questionId}`;
    this.http.delete(url, this.httpOptions).subscribe(
      () => this.retrieveQuestions(quizId).subscribe(),
      err => console.error('[QuestionService] deleteQuestion :', err)
    );
  }
  
  // Méthode pour enregistrer les questions personnalisées
  /*private saveCustomQuestions(): void {
    // Filtrer pour ne garder que les questions personnalisées (celles ajoutées)
    const customQuestions = this.allQuestions.filter(q => q.isCustom === true);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
  }*/
 updateQuestion(quizId: number, question: Question): void {
  // Recalculer ou s'assurer que ces propriétés sont à jour avant la mise à jour
  question.wordLength = question.text ? question.text.length : 0;
  question.hasSimilarLetters = this.checkForSimilarLetters(question.text || '');
  question.phoneticComplexity = question.phoneticComplexity || 0;

  const url = `${this.questionsUrl}/${quizId}/questions/${question.id}`;
  this.http.put(url, question, this.httpOptions).subscribe(
    () => this.retrieveQuestions(quizId).subscribe(),
    err => console.error('[QuestionService] updateQuestion :', err)
  );
}




  private checkForSimilarLetters(word: string): boolean {
    for (const group of this.similarLetterGroups) {
      const lettersInWord = group.filter(letter => word.includes(letter));
      if (lettersInWord.length > 1) {
        return true;
      }
    }
    return false;
  }
}