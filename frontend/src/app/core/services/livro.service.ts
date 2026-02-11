import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Livro, LivroDto } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private readonly apiUrl = `${environment.apiUrl}/livros`;
  private livrosSubject = new BehaviorSubject<Livro[]>([]);
  public livros$ = this.livrosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.apiUrl).pipe(
      tap(livros => this.livrosSubject.next(livros))
    );
  }

  getById(id: string): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }

  create(livro: LivroDto): Observable<Livro> {
    return this.http.post<Livro>(this.apiUrl, livro).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: string, livro: LivroDto): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${id}`, livro).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  uploadCapa(id: string, file: File): Observable<{ capaUrl: string }> {
    const formData = new FormData();
    formData.append('arquivo', file);
    return this.http.post<{ capaUrl: string }>(`${this.apiUrl}/${id}/capa`, formData).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  removerCapa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/capa`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
