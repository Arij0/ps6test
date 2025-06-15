import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/models/user.module';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;
  @Output() userCreated = new EventEmitter<User>();

  constructor(
    public formBuilder: FormBuilder, 
    public userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required], // Ajouter la validation
      lastName: ['', Validators.required],  // Ajouter la validation
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    // Ajouter du debugging
    console.log('UserFormComponent initialisé');
  }

  addUser(): void {
    console.log('=== DEBUT addUser() ===');
    console.log('Form valid:', this.userForm.valid);
    console.log('Form values:', this.userForm.getRawValue());
    console.log('Form errors:', this.getFormErrors());

    // Vérifier que le formulaire est valide
    if (this.userForm.valid) {
      const userToCreate: User = this.userForm.getRawValue() as User;
      
      console.log('Tentative de création utilisateur:', userToCreate);
      console.log('UserService disponible:', !!this.userService);
      
      this.userService.addUser(userToCreate).subscribe({
        next: (userCreated) => {
          console.log('Utilisateur créé avec succès:', userCreated);
          this.userCreated.emit(userCreated);
          this.userForm.reset();
          console.log('=== FIN addUser() SUCCESS ===');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          console.log('=== FIN addUser() ERROR ===');
        }
      });
    } else {
      console.log('Formulaire invalide - erreurs:', this.getFormErrors());
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      console.log('=== FIN addUser() FORM INVALID ===');
    }
  }

  // Méthode helper pour debugger les erreurs de formulaire
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }



imagePreview: string | null = null;

onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.userForm.patchValue({ imageUrl: this.imagePreview });
    };

    reader.readAsDataURL(file); // convertit en base64
  }
}

}