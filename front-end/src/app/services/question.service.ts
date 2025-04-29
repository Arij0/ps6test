import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { BehaviorSubject } from 'rxjs';
interface Question {
  text: string;
  options: string[];
  answer: string;
  hints: string[];
  wordLength: number;
  hasSimilarLetters: boolean;
  phoneticComplexity: number;
  isCustom?: boolean; 
}
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsSubject = new BehaviorSubject<any[]>([]);
  public questions$ = this.questionsSubject.asObservable();
  private allQuestions : Question[] = [
    {
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
    }
  ];
  private similarLetterGroups = [
    ['b', 'd'],
    ['p', 'q'],
    ['m', 'n'],
    ['v', 'w'],
    ['i', 'j', 'l'],
    ['a', 'e', 'o']
  ];

  constructor(private settingsService: SettingsService) {
    // Initialiser avec les questions existantes
    this.questionsSubject.next(this.allQuestions);
    
    // Récupérer les questions sauvegardées dans localStorage si elles existent
    const savedQuestions = localStorage.getItem('customQuestions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      // Ensure all loaded questions have the isCustom property set to true
      parsedQuestions.forEach((q: Question) => q.isCustom = true);
      this.allQuestions = [...this.allQuestions, ...parsedQuestions];
      this.questionsSubject.next(this.allQuestions);
    }
  }

  getQuestions(): Question[] {
    const settings = this.settingsService.getSettings();
    return this.filterQuestionsByDifficulty(this.allQuestions, settings);
  }
  addQuestion(question: Question): void {
    // Make sure the question has isCustom set to true
    question.isCustom = true;
    
    // Ajouter la question à notre liste
    this.allQuestions.push(question);
    this.questionsSubject.next(this.allQuestions);
    
    // Sauvegarder les questions personnalisées dans localStorage
    this.saveCustomQuestions();
  }
  
  // Méthode pour ajouter plusieurs questions
  addQuestions(questions: Question[]): void {
    // Make sure all questions have isCustom set to true
    questions.forEach(q => q.isCustom = true);
    
    this.allQuestions = [...this.allQuestions, ...questions];
    this.questionsSubject.next(this.allQuestions);
    
    // Sauvegarder les questions personnalisées dans localStorage
    this.saveCustomQuestions();
  }
  
  // Méthode pour enregistrer les questions personnalisées
  private saveCustomQuestions(): void {
    // Filtrer pour ne garder que les questions personnalisées (celles ajoutées)
    const customQuestions = this.allQuestions.filter(q => q.isCustom === true);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
  }


  private filterQuestionsByDifficulty(questions: any[], settings: any): any[] {
    return questions.filter(q => {
      // Filtrer selon la longueur des mots (si l'option est activée)
      if (settings.wordLength) {
        if (q.wordLength < settings.minWordLength || q.wordLength > settings.maxWordLength) {
          return false;
        }
      }

      // Filtrer selon les lettres similaires (si l'option est activée)
      if (settings.similarLetters) {
        // Pour le niveau facile, exclure les mots avec lettres similaires
        if (settings.difficulty === 'easy' && q.hasSimilarLetters) {
          return false;
        }
        // Pour le niveau difficile, inclure seulement les mots avec lettres similaires
        if (settings.difficulty === 'hard' && !q.hasSimilarLetters) {
          return false;
        }
      }

      // Filtrer selon la complexité phonétique (si l'option est activée)
      if (settings.phoneticComplexity) {
        if (q.phoneticComplexity > settings.phoneticComplexityLevel) {
          return false;
        }
      }

      return true;
    });
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