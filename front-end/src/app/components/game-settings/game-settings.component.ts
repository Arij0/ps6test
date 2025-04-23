// game-settings.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface pour définir la structure des paramètres du jeu
export interface GameSettings {
  difficulty: string;
  wordLength: string;
  confusableLetters: boolean;
  phoneticComplexity: string;
  hintType: string[];
  hintsCount: number;
  hintDelay: number;
  gameSpeed: number;
  interactionMode: string;
  timerEnabled: boolean;
  timerDuration: number;
  hideIncorrectAnswers: boolean;
  showFinalScore: boolean;
  feedbackLevel: string;
  showRemainingTime: boolean;
  motivationalMessage: string;
}

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  @Output() settingsChanged = new EventEmitter<GameSettings>();
  
  settingsForm: FormGroup;
  
  // Options pour les différents sélecteurs
  difficultyOptions = [
    { value: 'easy', label: 'Facile' },
    { value: 'medium', label: 'Moyen' },
    { value: 'hard', label: 'Difficile' }
  ];
  
  wordLengthOptions = [
    { value: 'short', label: 'Courts (3-4 lettres)' },
    { value: 'medium', label: 'Moyens (5-7 lettres)' },
    { value: 'long', label: 'Longs (8+ lettres)' }
  ];
  
  phoneticComplexityOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'complex', label: 'Complexe' }
  ];
  
  hintTypeOptions = [
    { value: 'text', label: 'Texte' },
    { value: 'animation', label: 'Animation' },
    { value: 'image', label: 'Image' },
    { value: 'audio', label: 'Audio' }
  ];
  
  interactionModeOptions = [
    { value: 'mouse', label: 'Souris' },
    { value: 'keyboard', label: 'Clavier' },
    { value: 'voice', label: 'Commande vocale' }
  ];
  
  feedbackLevelOptions = [
    { value: 'none', label: 'Aucun' },
    { value: 'basic', label: 'Basique' },
    { value: 'detailed', label: 'Détaillé' },
    { value: 'very-detailed', label: 'Très détaillé' }
  ];
  
  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      // Difficulté
      difficulty: ['medium', Validators.required],
      wordLength: ['medium', Validators.required],
      confusableLetters: [false],
      phoneticComplexity: ['simple', Validators.required],
      
      // Indices
      hintType: [['text'], Validators.required],
      hintsCount: [3, [Validators.required, Validators.min(0), Validators.max(5)]],
      hintDelay: [5, [Validators.required, Validators.min(0), Validators.max(30)]],
      
      // Vitesse et interaction
      gameSpeed: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      interactionMode: ['mouse', Validators.required],
      
      // Chronométrage
      timerEnabled: [true],
      timerDuration: [60, [Validators.required, Validators.min(10), Validators.max(300)]],
      showRemainingTime: [true],
      
      // Feedback et affichage
      hideIncorrectAnswers: [false],
      showFinalScore: [true],
      feedbackLevel: ['basic', Validators.required],
      motivationalMessage: ['Tu peux y arriver !']
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
    // Émettre les paramètres initiaux
    this.emitCurrentSettings();
  }

  private setupFormListeners(): void {
    // Activer/désactiver le champ timerDuration en fonction de timerEnabled
    this.settingsForm.get('timerEnabled')?.valueChanges.subscribe(enabled => {
      const timerDurationControl = this.settingsForm.get('timerDuration');
      const showRemainingTimeControl = this.settingsForm.get('showRemainingTime');
      
      if (timerDurationControl && showRemainingTimeControl) {
        if (enabled) {
          timerDurationControl.enable();
          showRemainingTimeControl.enable();
        } else {
          timerDurationControl.disable();
          showRemainingTimeControl.disable();
        }
      }
    });
    
    // Écouter les changements du formulaire et émettre les nouveaux paramètres
    this.settingsForm.valueChanges.subscribe(() => {
      this.emitCurrentSettings();
    });
  }

  emitCurrentSettings(): void {
    if (this.settingsForm.valid) {
      this.settingsChanged.emit(this.settingsForm.value as GameSettings);
    }
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      // Enregistrer les paramètres (localStorage, service, etc.)
      console.log('Paramètres enregistrés:', this.settingsForm.value);
      this.emitCurrentSettings();
      // Vous pourriez ajouter une notification de succès ici
    }
  }

  resetToDefault(): void {
    this.settingsForm.reset({
      difficulty: 'medium',
      wordLength: 'medium',
      confusableLetters: false,
      phoneticComplexity: 'simple',
      hintType: ['text'],
      hintsCount: 3,
      hintDelay: 5,
      gameSpeed: 5,
      interactionMode: 'mouse',
      timerEnabled: true,
      timerDuration: 60,
      showRemainingTime: true,
      hideIncorrectAnswers: false,
      showFinalScore: true,
      feedbackLevel: 'basic',
      motivationalMessage: 'Tu peux y arriver !'
    });
  }
}