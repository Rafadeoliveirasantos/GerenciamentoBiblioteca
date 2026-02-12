import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, TokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private tokenSubject = new BehaviorSubject<string | null>(this.obterToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credenciais: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap(resposta => {
        console.log('Login realizado com sucesso');
        this.salvarToken(resposta.token);
        this.tokenSubject.next(resposta.token);
      })
    );
  }

  logout(): void {
    console.log('Logout realizado');
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  // Valida se usuário está logado
  isAuthenticated(): boolean {
    const token = this.obterToken();
    return !!token;
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  // TODO: implementar refresh token
  private salvarToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
