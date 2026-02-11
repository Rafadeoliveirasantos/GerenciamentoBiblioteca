import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sistema de Biblioteca</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuário</mat-label>
              <input matInput formControlName="username" autocomplete="username">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password">
            </mat-form-field>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button mat-raised-button color="primary" type="submit" [disabled]="loading || !loginForm.valid" class="full-width">
              <span *ngIf="!loading">Entrar</span>
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            </button>
          </form>
          <div class="hint">Usuário: admin | Senha: Admin@123</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #F5F5F5;
    }
    .login-card {
      width: 400px;
      max-width: 90%;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .error-message {
      color: #D13438;
      margin-bottom: 16px;
      text-align: center;
    }
    .hint {
      margin-top: 16px;
      text-align: center;
      font-size: 12px;
      color: #605E5C;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/livros']);
        },
        error: () => {
          this.errorMessage = 'Usuário ou senha inválidos';
          this.loading = false;
        }
      });
    }
  }
}
