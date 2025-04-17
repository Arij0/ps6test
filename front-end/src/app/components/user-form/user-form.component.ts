import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  // Propriétés du formulaire
  nom: string = '';
  prenom: string = '';
  email: string = '';
  adresse: string = '';
  numeroTelephone: string = '';
  photoPreview: string | ArrayBuffer | null = null; // ✅ Déclarée au bon endroit

  // ✅ Méthode pour gérer la sélection de la photo
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.photoPreview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // ✅ Méthode pour soumettre le formulaire
  ajouterEnfant(): void {
    const enfant = {
      nom: this.nom,
      prenom: this.prenom,
      emailParent: this.email,
      adresseParent: this.adresse,
      telephoneParent: this.numeroTelephone,
      photo: this.photoPreview // Ajout facultatif si tu veux la traiter
    };

    console.log('Enfant à ajouter:', enfant);
    // TODO: ajouter l’appel au service backend ici

    // Réinitialisation du formulaire
    this.resetForm();
  }

  private resetForm(): void {
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.adresse = '';
    this.numeroTelephone = '';
    this.photoPreview = null;
  }
}
