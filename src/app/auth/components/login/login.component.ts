import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthApplicationService } from '../../../application/services/auth-application.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthApplicationService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Toujours rediriger vers le dashboard après connexion
    this.returnUrl = '/dashboard';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.isLoading = true;
    this.error = '';

    this.authService.login(username, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Redirection basée sur le rôle
        this.redirectUserBasedOnRole(user);
      },
      error: error => {
        console.error('Erreur de connexion:', error);
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  // Redirection basée sur le rôle utilisateur
  private redirectUserBasedOnRole(user: any) {
    console.log('Redirection pour utilisateur:', user);

    if (user.isFormateur()) {
      console.log('Redirection vers dashboard formateur');
      this.router.navigate(['/dashboard'], {
        queryParams: { role: 'formateur' }
      });
    } else if (user.isEtudiant()) {
      console.log('Redirection vers dashboard étudiant');
      this.router.navigate(['/dashboard'], {
        queryParams: { role: 'etudiant' }
      });
    } else {
      console.log('Redirection par défaut vers dashboard');
      this.router.navigate(['/dashboard']);
    }
  }

}
