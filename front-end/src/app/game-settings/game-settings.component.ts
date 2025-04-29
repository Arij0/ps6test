import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators, FormArray } from '@angular/forms';
import { GameSettingsService } from '../services/game-settings.service';
import { SettingsService } from '../services/settings.service'; // si les deux services sont nécessaires
import { Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
interface DifficultySettings {
  minWordLength: number;
  maxWordLength: number;
  includeSimilarLetters: boolean;
  phoneticComplexityLevel: number;
}
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
@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  @Output() settingsChanged = new EventEmitter<any>();
  
  settingsForm!: FormGroup;
  questionsForm!: FormArray;  
  customQuestions: Question[] = [];
  questionsCount: number = 3;
  // Préréglages de difficulté
  difficultyPresets: { [key: string]: DifficultySettings } = {
    'easy': {
      minWordLength: 3,
      maxWordLength: 5,
      includeSimilarLetters: false,
      phoneticComplexityLevel: 1
    },
    'medium': {
      minWordLength: 4,
      maxWordLength: 7,
      includeSimilarLetters: true,
      phoneticComplexityLevel: 2
    },
    'hard': {
      minWordLength: 6,
      maxWordLength: 10,
      includeSimilarLetters: true,
      phoneticComplexityLevel: 3
    }
  };

  similarLetterGroups = [
    ['b', 'd'], ['p', 'q'], ['m', 'n'], ['v', 'w'], ['i', 'j', 'l'], ['a', 'e', 'o']
  ];

  phoneticComplexityWords = {
    1: ['matin', 'papa', 'main', 'amie', 'chat'],
    2: ['bateau', 'maison', 'chemin', 'jardin', 'musique'],
    3: ['rhinocéros', 'pharmacien', 'chirurgien', 'psychiatre', 'xylophone']
  };

  difficultyLevels = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' }
  ];

  hintTypes = [
    { value: 'text', label: 'Texte' },
    { value: 'animation', label: 'Animation' },
    { value: 'image', label: 'Image' },
    { value: 'audio', label: 'Audio' }
  ];

  interactionModes = [
    { value: 'mouse', label: 'Souris' },
    { value: 'voice', label: 'Saisie vocale' },
    { value: 'keyboard', label: 'Clavier' }
  ];

  feedbackLevels = [
    { value: 'none', label: 'Aucun' },
    { value: 'basic', label: 'Basique' },
    { value: 'detailed', label: 'Détaillé' },
    { value: 'very-detailed', label: 'Très détaillé' }
  ];

  questionTypes = [
    { value: 'multiple-choice', label: 'Choix multiple' },
    { value: 'true-false', label: 'Vrai/Faux' },
    { value: 'fill-in-the-blank', label: 'Texte à trou' }
  ];

  constructor(
    private fb: FormBuilder,
    private gameSettingsService: GameSettingsService,
    private settingsService: SettingsService ,
    private router: Router,
    private questionService: QuestionService,
  ) {
    this.questionsForm = this.fb.array([]);
  }

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.initQuestionManagement();
      this.updateQuestionsCount();
    }, 0);
  }

  initForm(): void {
    const currentSettings = this.settingsService.getSettings();
    this.settingsForm = this.fb.group({
      // Indices
      difficulty: [currentSettings.difficulty || 'medium'],
      wordLength: [currentSettings.wordLength !== undefined ? currentSettings.wordLength : true],
      similarLetters: [currentSettings.similarLetters !== undefined ? currentSettings.similarLetters : true],
      phoneticComplexity: [currentSettings.phoneticComplexity !== undefined ? currentSettings.phoneticComplexity : true],
      hintType: ['text'],
      hintsPerExercise: [this.gameSettingsService.getHintsToShow()],
      hintsCount: [3],
      hintDelay: [currentSettings.hintDelay || 5],
      gameSpeed: [currentSettings.gameSpeed || 5],
      interactionMode: [currentSettings.interactionMode || 'mouse'],
      timerEnabled: [currentSettings.timerEnabled !== undefined ? currentSettings.timerEnabled : false],
      timerDuration: [currentSettings.timerDuration || 60],
      hideWrongAnswers: [currentSettings.hideWrongAnswers !== undefined ? currentSettings.hideWrongAnswers : true],
      showFinalScore: [currentSettings.showFinalScore !== undefined ? currentSettings.showFinalScore : true],
      feedbackLevel: [currentSettings.feedbackLevel || 'detailed'],
      questions: this.questionsForm
      
      
    });
  }
  createQuestionFormGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      hint: [''],
      options: this.fb.array([
        this.fb.control('', Validators.required), // First option (correct answer)
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),
      correctAnswer: [0] // Index of correct answer (default to the first option)
    });
  }
  
  // Add a new question to the form array
  addQuestion(): void {
    this.questionsForm.push(this.createQuestionFormGroup());
  }
  
  // Remove a question from the form array
  removeQuestion(index: number): void {
    this.questionsForm.removeAt(index);
  }
  
  initQuestionManagement(): void {
    const generateButton = document.getElementById('generate-questions');
    if (generateButton) {
      generateButton.addEventListener('click', () => {
        this.updateQuestionsCount();
      });
    }
  }
  
  updateQuestionsCount(): void {
    const countInput = document.getElementById('questions-count') as HTMLInputElement;
    if (countInput) {
      this.questionsCount = parseInt(countInput.value) || 3;
    }
    
    // Clear the current form array
    while (this.questionsForm.length) {
      this.questionsForm.removeAt(0);
    }
    
    // Add the new number of questions
    for (let i = 0; i < this.questionsCount; i++) {
      this.addQuestion();
    }
    
    this.generateQuestionFields();
  }
  
  generateQuestionFields(): void {
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer) {
      // Effacer le contenu actuel
      questionsContainer.innerHTML = '';
      
      // Générer les nouveaux champs de questions
      for (let i = 1; i <= this.questionsCount; i++) {
        const questionItem = this.createQuestionItem(i);
        questionsContainer.appendChild(questionItem);
      }
    }
  }
  
  createQuestionItem(index: number): HTMLDivElement {
    // Créer un élément de question
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    
    // Ajouter le numéro de question
    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = index.toString();
    questionItem.appendChild(questionNumber);
    
    // Ajouter le champ de question
    const questionLabel = document.createElement('label');
    questionLabel.setAttribute('for', `question-${index}`);
    questionLabel.textContent = 'Question';
    questionItem.appendChild(questionLabel);
    
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.id = `question-${index}`;
    questionInput.className = 'question-field';
    questionInput.placeholder = 'Entrez votre question ici...';
    // Add event listener to update the reactive form
    questionInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const formGroup = this.questionsForm.at(index - 1) as FormGroup;
      formGroup.get('text')?.setValue(target.value);
    });
    questionItem.appendChild(questionInput);
    
    // Ajouter le champ d'indice
    const hintLabel = document.createElement('label');
    hintLabel.setAttribute('for', `hint-${index}`);
    hintLabel.textContent = 'Indice';
    questionItem.appendChild(hintLabel);
    
    const hintInput = document.createElement('input');
    hintInput.type = 'text';
    hintInput.id = `hint-${index}`;
    hintInput.className = 'hint-field';
    hintInput.placeholder = 'Entrez un indice pour cette question...';
    // Add event listener for hint
    hintInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const formGroup = this.questionsForm.at(index - 1) as FormGroup;
      formGroup.get('hint')?.setValue(target.value);
    });
    questionItem.appendChild(hintInput);
    
    // Ajouter le conteneur d'options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Créer 4 options
    for (let j = 1; j <= 4; j++) {
      const optionItem = document.createElement('div');
      optionItem.className = 'option-item';
      
      const optionRadio = document.createElement('input');
      optionRadio.type = 'radio';
      optionRadio.name = `correct-${index}`;
      optionRadio.className = 'option-radio';
      optionRadio.id = `option-${index}-${j}`;
      if (j === 1) optionRadio.checked = true;
      
      // Add event listener for correct answer selection
      optionRadio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
          const formGroup = this.questionsForm.at(index - 1) as FormGroup;
          formGroup.get('correctAnswer')?.setValue(j - 1);
        }
      });
      
      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.className = 'option-input';
      optionInput.placeholder = j === 1 ? 'Option 1 (correcte)' : `Option ${j}`;
      
      // Add event listener for option input
      optionInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const formGroup = this.questionsForm.at(index - 1) as FormGroup;
        const optionsArray = formGroup.get('options') as FormArray;
        optionsArray.at(j - 1).setValue(target.value);
      });
      
      optionItem.appendChild(optionRadio);
      optionItem.appendChild(optionInput);
      
      optionsContainer.appendChild(optionItem);
    }
    
    questionItem.appendChild(optionsContainer);
    
    return questionItem;
  }
  
  collectCustomQuestions(): Question[] {
    const questions: Question[] = [];
    
    // Use the reactive form data instead of DOM queries
    for (let i = 0; i < this.questionsForm.length; i++) {
      const formGroup = this.questionsForm.at(i) as FormGroup;
      const questionText = formGroup.get('text')?.value;
      const hint = formGroup.get('hint')?.value;
      const options = (formGroup.get('options') as FormArray).value;
      const correctAnswerIndex = formGroup.get('correctAnswer')?.value;
      
      const answer = options[correctAnswerIndex];
      
      // Filter out empty options
      const validOptions = options.filter((opt: string) => opt.trim() !== '');
      
      // Vérifier si la question est valide
      if (questionText && validOptions.length > 0 && answer) {
        // Calculer la longueur du mot (utilisant la réponse)
        const wordLength = answer.length;
        
        // Vérifier si le mot contient des lettres similaires
        const hasSimilarLetters = this.checkForSimilarLetters(answer.toLowerCase());
        
        // Déterminer la complexité phonétique
        const phoneticComplexity = this.determinePhoneticComplexity(answer.toLowerCase());
        
        questions.push({
          text: questionText,
          options: validOptions,
          answer: answer,
          hints: hint ? [hint] : [],
          wordLength: wordLength,
          hasSimilarLetters: hasSimilarLetters,
          phoneticComplexity: phoneticComplexity,
          isCustom: true
        });
      }
    }
    
    return questions;
  }

  onSettingsChange(): void {
    const formSettings = this.settingsForm.value;
    const difficultySettings = this.calculateDifficultySettings(formSettings);
    const customQuestions = this.collectCustomQuestions();
    if (customQuestions.length > 0) {
      this.questionService.addQuestions(customQuestions);
    }
    const completeSettings = {
      ...formSettings,
      ...difficultySettings,
      similarLetterGroups: this.similarLetterGroups,
      
      hintsPerExercise: formSettings.hintsPerExercise,
      hintsCount: formSettings.hintsCount
    };

    this.settingsService.updateSettings(completeSettings);
    this.gameSettingsService.setHintsToShow(formSettings.hintsPerExercise);
    this.settingsChanged.emit(completeSettings);
    
    alert('Paramètres enregistrés avec succès!');
    this.router.navigate(['/game']);
  }

  calculateDifficultySettings(settings: any): any {
    // Récupérer les préréglages de base pour le niveau choisi
    const baseSettings = this.difficultyPresets[settings.difficulty];
    const result: any = {};
    
    // Configurer la longueur des mots si l'option est activée
    if (settings.wordLength) {
      result.minWordLength = baseSettings.minWordLength;
      result.maxWordLength = baseSettings.maxWordLength;
    } else {
  
      result.minWordLength = 3;
      result.maxWordLength = 5;
    }
    
    if (settings.similarLetters) {
      result.includeSimilarLetters = baseSettings.includeSimilarLetters;
      result.similarLetterGroups = this.similarLetterGroups;
    } else {
      result.includeSimilarLetters = false;
    }
    
    if (settings.phoneticComplexity) {
      result.phoneticComplexityLevel = baseSettings.phoneticComplexityLevel;
      result.availableComplexityLevels = 
        Array.from({length: baseSettings.phoneticComplexityLevel}, (_, i) => i + 1);
    } else {
      result.phoneticComplexityLevel = 1;
      result.availableComplexityLevels = [1];
    }
    
    return result;
  }
  checkForSimilarLetters(word: string): boolean {
    for (const group of this.similarLetterGroups) {
      const lettersInWord = group.filter(letter => word.includes(letter));
      if (lettersInWord.length > 1) {
        return true;
      }
    }
    return false;
  }

  determinePhoneticComplexity(word: string): number {
    if (this.hasComplexPatterns(word)) {
      return 3; 
    } else if (this.hasMediumPatterns(word)) {
      return 2;
    }
    return 1; 
  }

  hasComplexPatterns(word: string): boolean {
    const complexPatterns = ['ph', 'ch', 'gn', 'qu', 'ille', 'euil', 'ail'];
    return complexPatterns.some(pattern => word.includes(pattern));
  }

  hasMediumPatterns(word: string): boolean {
    const mediumPatterns = ['ou', 'on', 'in', 'an', 'en', 'ai', 'ei', 'au', 'eu', 'oi', 'ui', 'ue'];
    return mediumPatterns.some(pattern => word.includes(pattern));
  }

  resetSettings(): void {
    // Réinitialiser les paramètres via le service
    this.settingsService.resetSettings();
    // Réinitialiser le formulaire avec les valeurs par défaut
    this.initForm();
    // Afficher un message de confirmation
    alert('Paramètres réinitialisés avec succès!');
  }
}
