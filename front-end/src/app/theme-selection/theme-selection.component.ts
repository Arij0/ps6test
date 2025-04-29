import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-selection',
  templateUrl: './theme-selection.component.html',
  styleUrls: ['./theme-selection.component.scss']
})


export class ThemeSelectionComponent {
  themes = [
    { id: 'princess', title: 'Princess World', image: 'assets/images/princess.png', colors: { background: '#f8bbd0', text: '#d81b60', button: '#e91e63' } },
    { id: 'cars', title: 'Cars World', image: 'assets/images/cars.png', colors: { background: '#bbdefb', text: '#1e88e5', button: '#2196f3' } },
    { id: 'ocean', title: 'Ocean World', image: 'assets/images/ocean.png', colors: { background: '#b2ebf2', text: '#0097a7', button: '#009688' } },
    { id: 'space', title: 'Space World', image: 'assets/images/space.png', colors: { background: '#d1c4e9', text: '#5e35b1', button: '#673ab7' } },
    // ... other themes
  ];

  goToQuiz(themeId: string) {
    // Implement navigation to the quiz page based on themeId
    //console.log(`Navigating to quiz for theme: ${themeId}`);
    this.router.navigate(['/game', themeId]);
    // In a real application, you would use Angular's Router to navigate:
    // this.router.navigate(['/quiz', themeId]);
  }

  constructor(private router: Router) {}
}