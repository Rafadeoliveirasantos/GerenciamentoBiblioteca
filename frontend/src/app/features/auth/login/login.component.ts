import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background"></div>
      <mat-card class="login-card">
        <div class="card-header">
          <div class="icon-container">
            <mat-icon class="book-icon">menu_book</mat-icon>
          </div>
          <h1 class="title">Sistema de Biblioteca</h1>
          <p class="subtitle">Faça login para continuar</p>
        </div>
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
            <div *ngIf="errorMessage" class="error-message">
              <mat-icon class="error-icon">error_outline</mat-icon>
              {{ errorMessage }}
            </div>
            <button mat-raised-button class="azure-button full-width" type="submit" [disabled]="loading || !loginForm.valid">
              <span *ngIf="!loading">Entrar</span>
              <mat-spinner *ngIf="loading" diameter="20" class="spinner"></mat-spinner>
            </button>
          </form>
          <div class="hint">
            <mat-icon class="hint-icon">info_outline</mat-icon>
            Usuário: <strong>admin</strong> | Senha: <strong>Admin&#64;123</strong>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      z-index: 0;
    }

    .login-card {
      position: relative;
      z-index: 1;
      width: 440px;
      max-width: 90%;
      padding: 48px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0078D4 0%, #0063B1 100%);
      box-shadow: 0 8px 24px rgba(0, 120, 212, 0.3);
      margin-bottom: 24px;
    }

    .book-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
    }

    .title {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 14px;
      color: #605E5C;
      margin: 0;
      font-weight: 400;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 4px;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #fafafa;
      border-radius: 8px;
    }

    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: transparent;
    }

    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: #E1E1E1;
      transition: border-color 0.3s ease;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: #0078D4 !important;
      border-width: 2px;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-text-field-wrapper {
      box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
    }

    .azure-button {
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #0078D4 0%, #0063B1 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
      transition: all 0.3s ease;
      text-transform: uppercase;
      margin-top: 8px;
    }

    .azure-button:not(:disabled):hover {
      background: linear-gradient(135deg, #106EBE 0%, #005A9E 100%);
      box-shadow: 0 6px 20px rgba(0, 120, 212, 0.4);
      transform: translateY(-2px);
    }

    .azure-button:not(:disabled):active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 120, 212, 0.3);
    }

    .azure-button:disabled {
      background: linear-gradient(135deg, #cccccc 0%, #999999 100%);
      box-shadow: none;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .spinner {
      display: inline-block;
    }

    ::ng-deep .spinner circle {
      stroke: white;
    }

    .error-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      background-color: #FDE7E9;
      border-left: 4px solid #D13438;
      border-radius: 6px;
      color: #D13438;
      font-size: 14px;
      font-weight: 500;
      animation: shake 0.4s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    .error-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding: 16px;
      text-align: center;
      font-size: 13px;
      color: #605E5C;
      background-color: #F3F2F1;
      border-radius: 8px;
      border: 1px solid #E1DFDD;
    }

    .hint strong {
      color: #323130;
      font-weight: 600;
    }

    .hint-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #0078D4;
    }

    @media (max-width: 600px) {
      .login-card {
        padding: 32px 24px;
      }

      .title {
        font-size: 24px;
      }

      .icon-container {
        width: 64px;
        height: 64px;
      }

      .book-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }
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
