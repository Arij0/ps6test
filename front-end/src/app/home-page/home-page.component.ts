import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  gameTitle = "Monde Magique des Enfants";
  gameDescription = "Bienvenue dans un univers coloré et amusant où les enfants peuvent apprendre tout en jouant. Explorez différents mini-jeux éducatifs adaptés pour stimuler la créativité et développer de nouvelles compétences.";
  
  features = [
    {
      title: "Apprentissage Ludique",
      description: "Des jeux conçus pour apprendre en s'amusant",
      icon: "school"
    },
    {
      title: "Sûr et Adapté",
      description: "Environnement sécurisé spécialement conçu pour les enfants",
      icon: "security"
    },
    {
      title: "Coloré et Interactif",
      description: "Interface attrayante qui stimule l'imagination",
      icon: "palette"
    }
  ];
}
