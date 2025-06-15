
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup; // Utilisation de ! pour le non-null assertion operator
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  hidePassword = true;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Simuler une authentification
    setTimeout(() => {
      if (this.f['username'].value === 'admin' && this.f['password'].value === 'admin123') {
        this.successMessage = 'Connexion réussie! Redirection vers le tableau de bord...';
        // Ici, vous pourriez naviguer vers le tableau de bord ou stocker des tokens
      } else {
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
      this.loading = false;
    }, 1500);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}