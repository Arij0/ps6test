import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-box',
  templateUrl: './theme-box.component.html',
  styleUrls: ['./theme-box.component.scss']
})
export class ThemeBoxComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() backgroundColor: string = '';
  @Input() textColor: string = '';
  @Input() buttonColor: string = '';
  @Input() themeId: string = ''; // Assure-toi de recevoir l'ID du thème comme un Input
  @Output() play = new EventEmitter<string>(); // Émet l'événement lorsque "Play Now" est cliqué

  constructor(private router: Router) {}

  onPlayClick() {
    // Rediriger vers la page de jeu en utilisant l'ID du thème
    this.play.emit(this.themeId);
  }
}
