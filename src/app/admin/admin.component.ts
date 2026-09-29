import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-box">
      <h2>Admin felület</h2>
      <p *ngIf="username">Bejelentkezve mint: {{ username }}</p>
      <button (click)="onLogout()">Kijelentkezés</button>
    </div>
  `,
  styles: [
    `
      .admin-box {
        max-width: 480px;
        margin: 80px auto;
        padding: 24px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: sans-serif;
      }
      button {
        padding: 8px 16px;
        cursor: pointer;
      }
    `
  ]
})
export class AdminComponent implements OnInit {
  username = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http
      .get<{ user: { username: string } }>('/api/me', {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` }
      })
      .subscribe({
        next: (res) => {
          this.username = res.user.username;
        },
        error: () => {
          this.onLogout();
        }
      });
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}