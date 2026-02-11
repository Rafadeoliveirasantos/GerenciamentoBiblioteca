import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" *ngIf="authService.isAuthenticated()">
        <span>Biblioteca</span>
        <span class="spacer"></span>
        <button mat-button routerLink="/livros">Livros</button>
        <button mat-button routerLink="/autores">Autores</button>
        <button mat-button routerLink="/generos">Gêneros</button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sair
        </button>
      </mat-toolbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .main-content {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
