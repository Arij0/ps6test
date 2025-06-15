import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  menuItems = [
    { name: 'Accueil', link: '/' },
    { name: ' Gestion des Enfants', link: '/users' },
    { name: 'Jeux', link: '/themes' }, 
    { name: 'Paramètres des Jeux', link: '/settings' },
    //{ name: 'Connexion', link: '/admin-login' }
  ];
  
  logoPath = 'assets/images/logo.png';
  
  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}