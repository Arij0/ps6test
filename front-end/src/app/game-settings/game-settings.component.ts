import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators, FormArray } from '@angular/forms';
import { GameSettingsService } from '../services/game-settings.service';
import { SettingsService } from '../services/settings.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { ThemeService } from '../services/theme.service';
import { Question } from 'src/models/questions.model';
import { QuizService } from '../services/quiz.service';
import { DifficultySettings } from 'src/models/questions.model';
@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  @Output() settingsChanged = new EventEmitter<any>();
  private navigationSource: string = '';
  private userId: string | null = null;
  nextQuestionId=1;
  settingsForm!: FormGroup;
  questionsForm!: FormArray; 
  presentationMode='default'; 
  customQuestions:
  
  Question[] = [];
  questionsCount: number = 3;
  selectedDifficultyLevel: 'easy' | 'medium' | 'hard' = 'medium';
  
  // Préréglages de difficulté
    difficultyPresets: { [key: string]: DifficultySettings } = {
    'easy': {
      level: 'easy',
      label: 'Facile',
      description: 'Parfait pour débuter - Mots courts, pas de lettres confuses',
      settings: {
        minWordLength: 3,
        maxWordLength: 5,
        allowWordLengthSelection: true,
        wordLengthOptions: [3, 4, 5],
        includeSimilarLetters: false,
        phoneticComplexityLevel: 1,
        hintsPerExercise: 3,
        timerEnabled: false,
        timerDuration: 90,
        secondChanceEnabled: true,
        maxAttempts: 3,
        showEncouragementOnSecondTry: true,
        autoHintOnSecondTry: true,
        reduceOptionsOnSecondTry: false,
        penalizeIncorrectAttempts: false,
        scorePenaltyPercentage: 0
      }
    },
    'medium': {
      level: 'medium',
      label: 'Moyen',
      description: 'Un bon équilibre - Quelques défis sans être trop difficile',
      settings: {
        minWordLength: 4,
        maxWordLength: 7,
        allowWordLengthSelection: true,
        wordLengthOptions: [4, 5, 6, 7],
        includeSimilarLetters: true,
        phoneticComplexityLevel: 2,
        hintsPerExercise: 2,
        timerEnabled: true,
        timerDuration: 60,
        secondChanceEnabled: true,
        maxAttempts: 2,
        showEncouragementOnSecondTry: true,
        autoHintOnSecondTry: false,
        reduceOptionsOnSecondTry: true,
        penalizeIncorrectAttempts: true,
        scorePenaltyPercentage: 15
      }
    },
    'hard': {
      level: 'hard',
      label: 'Difficile',
      description: 'Pour les experts - Mots longs et complexes',
      settings: {
        minWordLength: 6,
        maxWordLength: 10,
        allowWordLengthSelection: true,
        wordLengthOptions: [6, 7, 8, 9, 10],
        includeSimilarLetters: true,
        phoneticComplexityLevel: 3,
        hintsPerExercise: 1,
        timerEnabled: true,
        timerDuration: 45,
        secondChanceEnabled: false,
        maxAttempts: 1,
        showEncouragementOnSecondTry: false,
        autoHintOnSecondTry: false,
        reduceOptionsOnSecondTry: false,
        penalizeIncorrectAttempts: false,
        scorePenaltyPercentage: 0
      }
    }

  };
  speedPresets = {
  easy: 3,    // Plus lent pour les débutants
  medium: 5,  // Vitesse équilibrée  
  hard: 7     // Plus rapide pour les experts
};
  similarLetterGroups = [
    ['b', 'd'], ['p', 'q'], ['m', 'n'], ['v', 'w'], ['i', 'j', 'l'], ['a', 'e', 'o']
  ];
speedOptions = [
  { value: 1, label: 'Très lent', description: 'Idéal pour prendre son temps' },
  { value: 2, label: 'Lent', description: 'Permet une réflexion posée' },
  { value: 3, label: 'Lent+', description: 'Recommandé pour niveau facile' },
  { value: 4, label: 'Normal-', description: 'Rythme détendu' },
  { value: 5, label: 'Normal', description: 'Rythme équilibré' },
  { value: 6, label: 'Normal+', description: 'Légèrement plus dynamique' },
  { value: 7, label: 'Rapide', description: 'Recommandé pour niveau difficile' },
  { value: 8, label: 'Rapide+', description: 'Stimule la concentration' },
  { value: 9, label: 'Très rapide', description: 'Pour les experts' },
  { value: 10, label: 'Ultra rapide', description: 'Défi maximum' }
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
  
  // Options pour les tentatives
  attemptOptions = [
    { value: 2, label: '2 tentatives' },
    { value: 3, label: '3 tentatives' }
  ];

  // Messages d'encouragement par défaut
  defaultEncouragementMessages = [
    "Courage ! Essaie encore une fois !",
    "Tu peux y arriver ! Réfléchis bien !",
    "N'abandonne pas ! Une autre tentative !",
    "Presque ! Essaie encore !",
    "Tu es sur la bonne voie ! Continue !"
  ];
  constructor(
    private fb: FormBuilder,
    private gameSettingsService: GameSettingsService,
    private settingsService: SettingsService ,
    private router: Router,
    private route: ActivatedRoute, 
    private questionService: QuestionService,
    private quizService: QuizService ,
    private themeService: ThemeService
  ) {
    this.questionsForm = this.fb.array([]);
  }

  ngOnInit(): void {
    this.detectNavigationSource(); 
    this.initForm();
    
    this.setupFormValidation()
    setTimeout(() => {
      this.initQuestionManagement();
      this.updateQuestionsCount();
    }, 0);
  }
  selectDifficultyLevel(level: 'easy' | 'medium' | 'hard'): void {
    this.selectedDifficultyLevel = level;
    const presetSettings = this.difficultyPresets[level].settings;
    const recommendedSpeed = this.speedPresets[level];
    // Mettre à jour le formulaire avec les paramètres prédéfinis
    this.settingsForm.patchValue({
      difficulty: level,
      wordLength: true,
      selectedWordLength: null,
      wordLengthRange: 'all',
      customMinWordLength: presetSettings.minWordLength,
      customMaxWordLength: presetSettings.maxWordLength,
      similarLetters: presetSettings.includeSimilarLetters,
      phoneticComplexity: presetSettings.phoneticComplexityLevel > 1,
      hintsPerExercise: presetSettings.hintsPerExercise,
      timerEnabled: presetSettings.timerEnabled,
      timerDuration: presetSettings.timerDuration,
      gameSpeed: recommendedSpeed,
      secondChanceEnabled: presetSettings.secondChanceEnabled,
      maxAttempts: presetSettings.maxAttempts,
      showEncouragementOnSecondTry: presetSettings.showEncouragementOnSecondTry,
      autoHintOnSecondTry: presetSettings.autoHintOnSecondTry,
      reduceOptionsOnSecondTry: presetSettings.reduceOptionsOnSecondTry,
      penalizeIncorrectAttempts: presetSettings.penalizeIncorrectAttempts,
      scorePenaltyPercentage: presetSettings.scorePenaltyPercentage
    });
    this.gameSettingsService.setGameSpeedByDifficulty(level);
    console.log(`Niveau ${level} sélectionné avec les paramètres:`, presetSettings);
  }
  getRecommendedSpeed(): number {
  return this.speedPresets[this.selectedDifficultyLevel];
}

getCurrentSpeedLabel(): string {
  const currentSpeed = this.settingsForm.get('gameSpeed')?.value || 5;
  const speedOption = this.speedOptions.find(option => option.value === currentSpeed);
  return speedOption ? speedOption.label : 'Normal';
}

getCurrentSpeedDescription(): string {
  const currentSpeed = this.settingsForm.get('gameSpeed')?.value || 5;
  const speedOption = this.speedOptions.find(option => option.value === currentSpeed);
  return speedOption ? speedOption.description : 'Rythme équilibré';
}

isRecommendedSpeed(): boolean {
  const currentSpeed = this.settingsForm.get('gameSpeed')?.value || 5;
  const recommendedSpeed = this.getRecommendedSpeed();
  return currentSpeed === recommendedSpeed;
}

// Méthode pour réinitialiser la vitesse selon le niveau
resetSpeedToRecommended(): void {
  const recommendedSpeed = this.getRecommendedSpeed();
  this.settingsForm.patchValue({ gameSpeed: recommendedSpeed });
  this.gameSettingsService.setGameSpeed(recommendedSpeed);
}
  getAvailableWordLengths(): number[] {
  const preset = this.difficultyPresets[this.selectedDifficultyLevel];
  return preset.settings.wordLengthOptions || [];
}

getWordLengthRange(): { min: number, max: number } {
  const preset = this.difficultyPresets[this.selectedDifficultyLevel];
  return {
    min: preset.settings.minWordLength,
    max: preset.settings.maxWordLength
  };
}

canSelectWordLength(): boolean {
  const preset = this.difficultyPresets[this.selectedDifficultyLevel];
  return preset.settings.allowWordLengthSelection || false;
}
    shouldShowParameter(parameterName: string): boolean {
    const preset = this.difficultyPresets[this.selectedDifficultyLevel];
    
    switch (parameterName) {
      case 'similarLetters':
        return this.selectedDifficultyLevel !== 'easy';
      case 'phoneticComplexity':
        return this.selectedDifficultyLevel !== 'easy';
      case 'timer':
        return this.selectedDifficultyLevel !== 'easy';
      case 'secondChance':
        return this.selectedDifficultyLevel !== 'hard';
      case 'penalties':
        return this.selectedDifficultyLevel === 'medium';
      default:
        return true;
    }
  }
    getSelectedDifficultyDescription(): string {
    return this.difficultyPresets[this.selectedDifficultyLevel].description;
  }

  /**
   * Méthode pour obtenir les paramètres calculés selon la difficulté
   */
  private getCalculatedDifficultySettings(): any {
    const preset = this.difficultyPresets[this.selectedDifficultyLevel];
    return {
      minWordLength: preset.settings.minWordLength,
      maxWordLength: preset.settings.maxWordLength,
      includeSimilarLetters: preset.settings.includeSimilarLetters,
      phoneticComplexityLevel: preset.settings.phoneticComplexityLevel,
      availableComplexityLevels: Array.from(
        { length: preset.settings.phoneticComplexityLevel }, 
        (_, i) => i + 1
      ),
      similarLetterGroups: preset.settings.includeSimilarLetters ? this.similarLetterGroups : []
    };
  }


  private detectNavigationSource(): void {
    // Vérifier les query parameters pour userId (cas 1)
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.userId = params['userId'];
        this.navigationSource = 'user-selection';
        console.log('Navigation depuis user-selection avec userId:', this.userId);
      }
    });

    // Vérifier l'URL ou d'autres indicateurs pour le cas 2
    // Si pas de userId, on assume que c'est depuis le jeu
    if (!this.userId) {
      this.navigationSource = 'game';
      console.log('Navigation depuis le jeu');
    }
  }


  initForm(): void {
    const currentSettings = this.settingsService.getSettings();
      this.selectedDifficultyLevel = currentSettings.difficulty || 'medium';
      this.settingsForm = this.fb.group({
      // Indices
      difficulty: [[this.selectedDifficultyLevel],],
      wordLength: [currentSettings.wordLength !== undefined ? currentSettings.wordLength : true],
       selectedWordLength: [currentSettings.selectedWordLength || null], // Longueur spécifique choisie
      wordLengthRange: [currentSettings.wordLengthRange || 'all'], // 'all', 'specific', 'range'
      customMinWordLength: [currentSettings.customMinWordLength || null],
      customMaxWordLength: [currentSettings.customMaxWordLength || null],
    
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
      questions: this.questionsForm,
      secondChanceEnabled: [currentSettings.secondChanceEnabled !== undefined ? currentSettings.secondChanceEnabled : false],
      maxAttempts: [currentSettings.maxAttempts || 2, [Validators.min(2), Validators.max(3)]],
      removeWrongOption: [currentSettings.removeWrongOption !== undefined ? currentSettings.removeWrongOption : true],
      showEncouragementOnSecondTry: [currentSettings.showEncouragementOnSecondTry !== undefined ? currentSettings.showEncouragementOnSecondTry : true],
       showHintSuggestionAfterError: [currentSettings.showHintSuggestionAfterError !== undefined ? currentSettings.showHintSuggestionAfterError : true],
    hintSuggestionDelay: [currentSettings.hintSuggestionDelay || 3, [Validators.min(0), Validators.max(10)]],
    allowExtraHintAfterError: [currentSettings.allowExtraHintAfterError !== undefined ? currentSettings.allowExtraHintAfterError : false],
      autoHintOnSecondTry: [currentSettings.autoHintOnSecondTry !== undefined ? currentSettings.autoHintOnSecondTry : false],
      customEncouragementMessage: [currentSettings.customEncouragementMessage || ''],
      reduceOptionsOnSecondTry: [currentSettings.reduceOptionsOnSecondTry !== undefined ? currentSettings.reduceOptionsOnSecondTry : true],
      highlightCorrectArea: [currentSettings.highlightCorrectArea !== undefined ? currentSettings.highlightCorrectArea : false],
      penalizeIncorrectAttempts: [currentSettings.penalizeIncorrectAttempts !== undefined ? currentSettings.penalizeIncorrectAttempts : false],
      scorePenaltyPercentage: [currentSettings.scorePenaltyPercentage || 25, [Validators.min(0), Validators.max(100)]]
      
    });
  }
  hintSuggestionOptions = [
  { value: 0, label: 'Immédiatement' },
  { value: 2, label: 'Après 2 secondes' },
  { value: 3, label: 'Après 3 secondes' },
  { value: 5, label: 'Après 5 secondes' },
  { value: 10, label: 'Après 10 secondes' }
];
  
  private setupFormValidation(): void {
    // Validation conditionnelle pour les paramètres de seconde chance
    this.settingsForm.get('secondChanceEnabled')?.valueChanges.subscribe(enabled => {
      const maxAttemptsControl = this.settingsForm.get('maxAttempts');
      const scorePenaltyControl = this.settingsForm.get('scorePenaltyPercentage');
      
      if (enabled) {
        maxAttemptsControl?.setValidators([Validators.required, Validators.min(2), Validators.max(3)]);
        if (this.settingsForm.get('penalizeIncorrectAttempts')?.value) {
          scorePenaltyControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        }
      } else {
        maxAttemptsControl?.clearValidators();
        scorePenaltyControl?.clearValidators();
      }
      
      maxAttemptsControl?.updateValueAndValidity();
      scorePenaltyControl?.updateValueAndValidity();
    });
    this.settingsForm.get('showHintSuggestionAfterError')?.valueChanges.subscribe(showSuggestion => {
    const delayControl = this.settingsForm.get('hintSuggestionDelay');
    
    if (showSuggestion) {
      delayControl?.setValidators([Validators.required, Validators.min(0), Validators.max(10)]);
    } else {
      delayControl?.clearValidators();
    }
    
    delayControl?.updateValueAndValidity();
  });

  // Validation pour l'indice supplémentaire
  this.settingsForm.get('allowExtraHintAfterError')?.valueChanges.subscribe(allowExtra => {
    if (allowExtra && this.settingsForm.get('hintsPerExercise')?.value === 0) {
      console.warn('Un indice supplémentaire ne peut pas être autorisé si aucun indice n\'est disponible');
    }
  });

    // Validation pour la pénalité de score
    this.settingsForm.get('penalizeIncorrectAttempts')?.valueChanges.subscribe(penalize => {
      const scorePenaltyControl = this.settingsForm.get('scorePenaltyPercentage');
      
      if (penalize && this.settingsForm.get('secondChanceEnabled')?.value) {
        scorePenaltyControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      } else {
        scorePenaltyControl?.clearValidators();
      }
      
      scorePenaltyControl?.updateValueAndValidity();
    });
  }

   validateSecondChanceSettings(): { isValid: boolean; errors: string[] } {
    const formValues = this.settingsForm.value;
    const errors: string[] = [];
    
    if (formValues.secondChanceEnabled) {
      // Validation du nombre de tentatives
      if (formValues.maxAttempts < 2 || formValues.maxAttempts > 3) {
        errors.push('Le nombre de tentatives doit être entre 2 et 3');
      }
      
      // Validation de l'indice automatique
      if (formValues.autoHintOnSecondTry && formValues.hintsPerExercise === 0) {
        errors.push('L\'indice automatique ne peut pas être activé si aucun indice n\'est disponible');
      }
      
      // Validation du pourcentage de pénalité
      if (formValues.penalizeIncorrectAttempts) {
        if (formValues.scorePenaltyPercentage < 0 || formValues.scorePenaltyPercentage > 100) {
          errors.push('Le pourcentage de pénalité doit être entre 0 et 100');
        }
      }
      if (formValues.showHintSuggestionAfterError) {
      if (formValues.hintSuggestionDelay < 0 || formValues.hintSuggestionDelay > 10) {
        errors.push('Le délai de suggestion d\'indice doit être entre 0 et 10 secondes');
      }
    }
    
    // Validation pour l'indice supplémentaire
    if (formValues.allowExtraHintAfterError && formValues.hintsPerExercise === 0) {
      errors.push('Un indice supplémentaire ne peut pas être autorisé si aucun indice n\'est disponible par exercice');
    }
    
    // Validation de cohérence entre autoHintOnSecondTry et allowExtraHintAfterError
    //if (formValues.autoHintOnSecondTry && formValues.allowExtraHintAfterError) {
      //errors.push('Vous ne pouvez pas activer à la fois l\'indice automatique et l\'indice supplémentaire manuel');
   // }
      
      // Validation du message d'encouragement personnalisé
      if (formValues.showEncouragementOnSecondTry && formValues.customEncouragementMessage) {
        if (formValues.customEncouragementMessage.length > 200) {
          errors.push('Le message d\'encouragement ne peut pas dépasser 200 caractères');
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  // 5. Ajoutez des méthodes utilitaires pour la nouvelle fonctionnalité :
shouldShowHintSuggestion(attemptNumber: number): boolean {
  const formValues = this.settingsForm.value;
  return formValues.secondChanceEnabled && 
         formValues.showHintSuggestionAfterError && 
         attemptNumber > 1 && 
         formValues.hintsPerExercise > 0;
}

getHintSuggestionDelay(): number {
  return this.settingsForm.get('hintSuggestionDelay')?.value || 3;
}

// Mise à jour de la méthode canShowExtraHintAfterError pour gérer les deux cas

canShowExtraHintAfterError(attemptNumber: number, hintsUsed: number): boolean {
  const formValues = this.settingsForm.value;
  
  if (!formValues.secondChanceEnabled || attemptNumber <= 1) {
    return false;
  }
  
  // Si l'indice automatique est activé ET l'indice supplémentaire aussi
  if (formValues.autoHintOnSecondTry && formValues.allowExtraHintAfterError) {
    // L'indice automatique compte comme un indice utilisé
    // L'utilisateur peut encore demander un indice supplémentaire s'il en reste
    return (hintsUsed + 1) < formValues.hintsPerExercise; // +1 pour l'indice automatique
  }
  
  // Si seulement l'indice supplémentaire est activé
  if (formValues.allowExtraHintAfterError && !formValues.autoHintOnSecondTry) {
    return hintsUsed < formValues.hintsPerExercise;
  }
  
  return false;
}

// Nouvelle méthode pour gérer la combinaison des deux types d'indices
shouldShowBothHintTypes(attemptNumber: number): { auto: boolean, manual: boolean } {
  const formValues = this.settingsForm.value;
  
  return {
    auto: this.shouldShowAutoHint(attemptNumber),
    manual: formValues.secondChanceEnabled && 
            formValues.allowExtraHintAfterError && 
            attemptNumber > 1 && 
            formValues.hintsPerExercise > 0
  };
}


  // Méthode pour obtenir un message d'encouragement
  getEncouragementMessage(): string {
    const customMessage = this.settingsForm.get('customEncouragementMessage')?.value;
    
    if (customMessage && customMessage.trim()) {
      return customMessage.trim();
    }
    
    // Retourner un message aléatoire parmi les messages par défaut
    const randomIndex = Math.floor(Math.random() * this.defaultEncouragementMessages.length);
    return this.defaultEncouragementMessages[randomIndex];
  }

  // Méthode pour calculer le score avec pénalité
  calculateScoreWithPenalty(originalScore: number, attemptNumber: number): number {
    const formValues = this.settingsForm.value;
    
    if (!formValues.secondChanceEnabled || !formValues.penalizeIncorrectAttempts || attemptNumber === 1) {
      return originalScore;
    }
    
    const penaltyPercentage = formValues.scorePenaltyPercentage / 100;
    const penaltyAmount = originalScore * penaltyPercentage * (attemptNumber - 1);
    
    return Math.max(0, originalScore - penaltyAmount);
  }

  // Méthode pour vérifier si les indices doivent être affichés automatiquement
  shouldShowAutoHint(attemptNumber: number): boolean {
    const formValues = this.settingsForm.value;
    return formValues.secondChanceEnabled && 
           formValues.autoHintOnSecondTry && 
           attemptNumber > 1 && 
           formValues.hintsPerExercise > 0;
  }

  // Méthode pour obtenir le nombre d'options à afficher selon la tentative
  getOptionsCountForAttempt(attemptNumber: number, totalOptions: number): number {
    const formValues = this.settingsForm.value;
    
    if (!formValues.secondChanceEnabled || !formValues.reduceOptionsOnSecondTry || attemptNumber === 1) {
      return totalOptions;
    }
    
    // Réduire les options de 1 à chaque tentative supplémentaire, minimum 2 options
    return Math.max(2, totalOptions - (attemptNumber - 1));
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
          id: this.nextQuestionId++,
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
  // Valider les paramètres
  const validation = this.validateSecondChanceSettings();
  const wordLengthValidation = this.validateWordLengthSettings();
  
  if (!validation.isValid) {
    console.error('Erreurs de validation:', validation.errors);
    alert('Erreurs de validation:\n' + validation.errors.join('\n'));
    return;
  }

  const formSettings = this.settingsForm.value;
  const difficultySettings = this.calculateDifficultySettings(formSettings);
  const customQuestions = this.collectCustomQuestions();

  // Fusionner les paramètres
  const completeSettings = {
    ...formSettings,
    ...difficultySettings
  };

  console.log('[GameSettingsComponent] Settings complets:', completeSettings);

  // Gérer les questions personnalisées
  if (customQuestions.length > 0) {
    const currentQuizId = this.quizService.getCurrentQuizId();
    if (currentQuizId) {
      console.log('Ajout de', customQuestions.length, 'questions personnalisées au quiz', currentQuizId);
      
      this.questionService.addQuestions(parseInt(currentQuizId), customQuestions).subscribe({
        next: (response) => {
          console.log('Questions ajoutées:', response);
          // Maintenant appliquer les filtres avec les settings complets
          this.questionService.retrieveQuestionsWithSettings(parseInt(currentQuizId), completeSettings).subscribe({
            next: (filteredQuestions) => {
              console.log('Questions filtrées:', filteredQuestions);
              this.finalizeSettingsUpdate(completeSettings, difficultySettings);
            },
            error: (error) => {
              console.error('Erreur lors du filtrage:', error);
              this.finalizeSettingsUpdate(completeSettings, difficultySettings);
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout des questions:', error);
          this.finalizeSettingsUpdate(completeSettings, difficultySettings);
        }
      });
    } else {
      console.warn('Aucun quizId actuel trouvé');
      this.finalizeSettingsUpdate(completeSettings, difficultySettings);
    }
  } else {
    // Pas de questions personnalisées, appliquer directement les filtres
    const currentQuizId = this.quizService.getCurrentQuizId();
    if (currentQuizId) {
      this.questionService.retrieveQuestionsWithSettings(parseInt(currentQuizId), completeSettings).subscribe({
        next: (filteredQuestions) => {
          console.log('Questions filtrées (sans questions custom):', filteredQuestions);
          this.finalizeSettingsUpdate(completeSettings, difficultySettings);
        },
        error: (error) => {
          console.error('Erreur lors du filtrage (sans questions custom):', error);
          this.finalizeSettingsUpdate(completeSettings, difficultySettings);
        }
      });
    } else {
      this.finalizeSettingsUpdate(completeSettings, difficultySettings);
    }
  }
}
private finalizeSettingsUpdate(formSettings: any, difficultySettings: any): void {
  const completeSettings = {
    ...formSettings,
    ...difficultySettings,
    similarLetterGroups: this.similarLetterGroups,
    hintsPerExercise: formSettings.hintsPerExercise,
    hintsCount: formSettings.hintsCount,
    gameSpeed: formSettings.gameSpeed,
    getEncouragementMessage: () => this.getEncouragementMessage(),
    calculateScoreWithPenalty: (score: number, attempt: number) => this.calculateScoreWithPenalty(score, attempt),
    shouldShowAutoHint: (attempt: number) => this.shouldShowAutoHint(attempt),
    getOptionsCountForAttempt: (attempt: number, total: number) => this.getOptionsCountForAttempt(attempt, total),
    shouldShowHintSuggestion: (attempt: number) => this.shouldShowHintSuggestion(attempt),
    getHintSuggestionDelay: () => this.getHintSuggestionDelay(),
    canShowExtraHintAfterError: (attempt: number, hintsUsed: number) => this.canShowExtraHintAfterError(attempt, hintsUsed)
  };

  this.settingsService.updateSettings(completeSettings);
  this.gameSettingsService.setHintsToShow(formSettings.hintsPerExercise);
  this.gameSettingsService.setHideWrongAnswers(formSettings.hideWrongAnswers);
  this.gameSettingsService.setGameSpeed(formSettings.gameSpeed);
  
  this.settingsChanged.emit(completeSettings);
  this.handleRedirection();
}
 private handleRedirection(): void {
  console.log('handleRedirection - navigationSource:', this.navigationSource);
  
  switch (this.navigationSource) {
    case 'user-selection':
      // Cas 1: Vient de user.component via bouton "Paramètres"
      console.log('Cas user-selection, userId:', this.userId);
      if (this.userId) {
        this.router.navigate(['themes'], { queryParams: { userId: this.userId } });
      } else {
        this.router.navigate(['themes']);
      }
      break;

    case 'game':
      // Cas 2: Vient du jeu directement
      const currentThemeId = this.themeService.getCurrentThemeId();
      const currentQuizId = this.quizService.getCurrentQuizId();
      
      console.log('Cas game - currentThemeId:', currentThemeId);
      console.log('Cas game - currentQuizId:', currentQuizId);

      if (currentThemeId && currentQuizId) {
        console.log('Redirection vers game avec:', currentQuizId, currentThemeId);
        this.router.navigate(['game', currentQuizId, currentThemeId]);
      } else {
        console.log('Redirection vers home car themeId ou quizId manquant');
        this.router.navigate(['/']);
      }
      break;

    default:
      console.warn('Source de navigation inconnue:', this.navigationSource);
      const themeId = this.themeService.getCurrentThemeId();
      const quizId = this.quizService.getCurrentQuizId();
      
      console.log('Default case - themeId:', themeId);
      console.log('Default case - quizId:', quizId);

      if (themeId && quizId) {
        this.router.navigate(['game', quizId, themeId]);
      } else {
        console.log('Redirection vers home (default case)');
        this.router.navigate(['/']);
      }
  }
}

  calculateDifficultySettings(settings: any): any {
  // Récupérer les préréglages de base pour le niveau choisi
  const baseSettings = this.difficultyPresets[settings.difficulty].settings;
  const result: any = {};
  
  // Toujours utiliser les paramètres de longueur du préréglage de difficulté
  //result.minWordLength = baseSettings.minWordLength;
  //result.maxWordLength = baseSettings.maxWordLength;
  if (settings.wordLength && baseSettings.allowWordLengthSelection) {
    switch (settings.wordLengthRange) {
      case 'specific':
        // L'utilisateur a choisi une longueur spécifique
        result.minWordLength = settings.selectedWordLength;
        result.maxWordLength = settings.selectedWordLength;
        result.allowedWordLengths = [settings.selectedWordLength];
        break;
        
      case 'range':
        // L'utilisateur a défini une plage personnalisée dans l'intervalle autorisé
        result.minWordLength = Math.max(settings.customMinWordLength, baseSettings.minWordLength);
        result.maxWordLength = Math.min(settings.customMaxWordLength, baseSettings.maxWordLength);
        result.allowedWordLengths = this.generateRangeArray(result.minWordLength, result.maxWordLength);
        break;
        
      case 'all':
      default:
        // Utiliser toute la plage du niveau de difficulté
        result.minWordLength = baseSettings.minWordLength;
        result.maxWordLength = baseSettings.maxWordLength;
        result.allowedWordLengths = baseSettings.wordLengthOptions;
        break;
    }
  } else {
    // Paramètres par défaut du niveau de difficulté
    result.minWordLength = baseSettings.minWordLength;
    result.maxWordLength = baseSettings.maxWordLength;
    result.allowedWordLengths = baseSettings.wordLengthOptions;
  }
  
  // Configurer les lettres similaires selon le préréglage ET le choix utilisateur
  if (settings.similarLetters && baseSettings.includeSimilarLetters) {
    result.includeSimilarLetters = true;
    result.similarLetterGroups = this.similarLetterGroups;
  } else {
    result.includeSimilarLetters = false;
    result.similarLetterGroups = [];
  }
  
  // Configurer la complexité phonétique selon le préréglage ET le choix utilisateur
  if (settings.phoneticComplexity && baseSettings.phoneticComplexityLevel > 1) {
    result.phoneticComplexityLevel = baseSettings.phoneticComplexityLevel;
    result.availableComplexityLevels = 
      Array.from({length: baseSettings.phoneticComplexityLevel}, (_, i) => i + 1);
  } else {
    result.phoneticComplexityLevel = 1;
    result.availableComplexityLevels = [1];
  }
  
  // Ajouter tous les autres paramètres du préréglage de difficulté
  result.hintsPerExercise = baseSettings.hintsPerExercise;
  result.timerEnabled = baseSettings.timerEnabled;
  result.timerDuration = baseSettings.timerDuration;
  result.secondChanceEnabled = baseSettings.secondChanceEnabled;
  result.maxAttempts = baseSettings.maxAttempts;
  result.showEncouragementOnSecondTry = baseSettings.showEncouragementOnSecondTry;
  result.autoHintOnSecondTry = baseSettings.autoHintOnSecondTry;
  result.reduceOptionsOnSecondTry = baseSettings.reduceOptionsOnSecondTry;
  result.penalizeIncorrectAttempts = baseSettings.penalizeIncorrectAttempts;
  result.scorePenaltyPercentage = baseSettings.scorePenaltyPercentage;
  
  return result;
}
validateWordLengthSettings(): { isValid: boolean; errors: string[] } {
  const formValues = this.settingsForm.value;
  const errors: string[] = [];
  const preset = this.difficultyPresets[formValues.difficulty];
  
  if (formValues.wordLength && preset.settings.allowWordLengthSelection) {
    switch (formValues.wordLengthRange) {
      case 'specific':
        if (!formValues.selectedWordLength) {
          errors.push('Veuillez sélectionner une longueur de mot spécifique');
        } else if (!preset.settings.wordLengthOptions.includes(formValues.selectedWordLength)) {
          errors.push(`La longueur ${formValues.selectedWordLength} n'est pas autorisée pour le niveau ${preset.label}`);
        }
        break;
        
      case 'range':
        if (!formValues.customMinWordLength || !formValues.customMaxWordLength) {
          errors.push('Veuillez définir les limites minimale et maximale');
        } else if (formValues.customMinWordLength > formValues.customMaxWordLength) {
          errors.push('La longueur minimale ne peut pas être supérieure à la longueur maximale');
        } else if (formValues.customMinWordLength < preset.settings.minWordLength || 
                   formValues.customMaxWordLength > preset.settings.maxWordLength) {
          errors.push(`La plage doit être entre ${preset.settings.minWordLength} et ${preset.settings.maxWordLength} pour le niveau ${preset.label}`);
        }
        break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
private generateRangeArray(min: number, max: number): number[] {
  const range = [];
  for (let i = min; i <= max; i++) {
    range.push(i);
  }
  return range;
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
     this.handleRedirection();
  }
}