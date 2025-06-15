import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-selection',
  templateUrl: './theme-selection.component.html',
  styleUrls: ['./theme-selection.component.scss']
})


export class ThemeSelectionComponent {
  themes = [
    { id: 'princess', title: 'Monde des princesses', image: 'assets/images/princess.png', colors: { background: '#f8bbd0', text: '#d81b60', button: '#e91e63' } },
    { id: 'cars', title: 'Monde des voitures', image: 'assets/images/cars.png', colors: { background: '#bbdefb', text: '#1e88e5', button: '#2196f3' } },
    { id: 'ocean', title: 'Ocean', image: 'assets/images/ocean.png', colors: { background: '#b2ebf2', text: '#0097a7', button: '#009688' } },
    { id: 'space', title: 'Espace', image: 'assets/images/space.png', colors: { background: '#d1c4e9', text: '#5e35b1', button: '#673ab7' } },
    // ... other themes
  ];

  goToQuiz(themeId: string) {
    this.themeService.setCurrentThemeId(themeId); // Stockez le themeId dans le service
    this.router.navigate(['/quiz-list', themeId]);
  }

  constructor(private router: Router, private themeService: ThemeService) {}
}