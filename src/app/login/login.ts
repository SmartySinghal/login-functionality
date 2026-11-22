import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error.set('Invalid email or password');
        this.loading.set(false);
      },
    });
  }
}