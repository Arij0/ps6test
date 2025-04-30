import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  menuItems = [
    { name: 'Accueil', link: '/' },
    { name: 'Connexion', link: '/admin-login' },
    { name: 'Jeux', link: '/themes' }, // correction ici
    { name: 'Paramètres', link: '/settings' }
  ];
  
  logoPath = 'assets/images/logo.png';
  
  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}