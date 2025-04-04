import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'] // Retirer si le fichier CSS n'existe pas
})
export class UserFormComponent {
  // Propriétés du formulaire
  nom: string = '';
  prenom: string = '';
  email: string = '';
  adresse: string = '';
  numeroTelephone: string = '';

  // Méthode pour soumettre le formulaire
  ajouterEnfant() {
    const enfant = {
      nom: this.nom,
      prenom: this.prenom,
      emailParent: this.email,
      adresseParent: this.adresse,
      telephoneParent: this.numeroTelephone
    };

    console.log('Enfant à ajouter:', enfant);
    // Ici vous ajouterez l'appel à votre service API

    // Réinitialisation du formulaire (optionnelle)
    this.resetForm();
  }

  private resetForm() {
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.adresse = '';
    this.numeroTelephone = '';
  }
}