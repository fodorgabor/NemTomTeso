import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-box">
      <h2>Bejelentkezés</h2>
      <form (ngSubmit)="onSubmit()">
        <input
          type="text"
          placeholder="Felhasználónév"
          [(ngModel)]="username"
          name="username"
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          [(ngModel)]="password"
          name="password"
          required
        />
        <button type="submit">Belépés</button>
      </form>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </div>
  `,
  styles: [
    `
      .login-box {
        max-width: 320px;
        margin: 80px auto;
        padding: 24px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: sans-serif;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      input {
        padding: 8px;
        font-size: 14px;
      }
      button {
        padding: 8px;
        cursor: pointer;
      }
      .error {
        color: red;
        margin-top: 12px;
      }
    `
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.errorMessage = 'Hibás felhasználónév vagy jelszó';
      }
    });
  }
}