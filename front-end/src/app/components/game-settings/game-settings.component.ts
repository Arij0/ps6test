import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  @Input() childId: string = '';
  settingsForm: FormGroup;

  difficulty: string = 'medium';
  speed: number = 5;
  maxSpeed: number = 10;
  difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      showHints: ['no', Validators.required],
      hintsCount: [{ value: 3, disabled: true }],
      hintsType: [{ value: 'visual', disabled: true }],
      hintsTiming: [{ value: 'after-time', disabled: true }],
      hintsAfterTimeDelay: [{ value: 30, disabled: true }],
      enableChrono: ['no'],
      chronoDuration: [{ value: 60, disabled: true }],
      showRemainingTime: ['yes'],
      motivationalMessage: ['You can do it!']
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  onDifficultyChange(): void {
    console.log('Difficulty changed to:', this.difficulty);
  }

  onSpeedChange(): void {
    console.log('Speed changed to:', this.speed);
  }

  private setupFormListeners(): void {
    const showHintsControl = this.settingsForm.get('showHints');
    if (showHintsControl) {
      showHintsControl.valueChanges.subscribe(value => {
        const hintsControls = ['hintsCount', 'hintsType', 'hintsTiming', 'hintsAfterTimeDelay'];
        hintsControls.forEach(control => {
          const ctrl = this.settingsForm.get(control);
          if (ctrl) value === 'yes' ? ctrl.enable() : ctrl.disable();
        });
      });
    }

    const hintsTimingControl = this.settingsForm.get('hintsTiming');
    if (hintsTimingControl) {
      hintsTimingControl.valueChanges.subscribe(() => {
        this.updateHintsTimeDelayState();
      });
    }

    const enableChronoControl = this.settingsForm.get('enableChrono');
    if (enableChronoControl) {
      enableChronoControl.valueChanges.subscribe(value => {
        const chronoDurationControl = this.settingsForm.get('chronoDuration');
        if (chronoDurationControl) value === 'yes' ? chronoDurationControl.enable() : chronoDurationControl.disable();
      });
    }
  }

  updateHintsTimeDelayState(): void {
    const hintsTiming = this.settingsForm.get('hintsTiming')?.value;
    const hintsEnabled = this.settingsForm.get('showHints')?.value === 'yes';
    const hintsAfterTimeDelayControl = this.settingsForm.get('hintsAfterTimeDelay');
    if (hintsAfterTimeDelayControl) {
      if (hintsEnabled && hintsTiming === 'after-time') {
        hintsAfterTimeDelayControl.enable();
      } else {
        hintsAfterTimeDelayControl.disable();
      }
    }
  }
}
