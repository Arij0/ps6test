import { Component } from '@angular/core';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent {
  // Configuration de la vitesse
  speed: number = 5;
  readonly minSpeed: number = 1;
  readonly maxSpeed: number = 10;

  // Configuration de la difficulté
  difficulty: string = 'moderate';
  difficultyOptions = [
    { value: 'moderate', label: 'Modéré' },
    { value: 'severe', label: 'Sévère' },
    { value: 'light', label: 'Léger' }
  ];

  // Méthodes pour les changements
  onSpeedChange(): void {
    console.log('Vitesse mise à jour:', this.speed);
    // Ajoutez ici votre logique métier
  }

  onDifficultyChange(): void {
    console.log('Difficulté mise à jour:', this.difficulty);
    // Ajoutez ici votre logique métier
  }
}