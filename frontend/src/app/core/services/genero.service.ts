import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Genero, GeneroDto } from '../models/genero.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  private readonly apiUrl = `${environment.apiUrl}/generos`;
  private generosSubject = new BehaviorSubject<Genero[]>([]);
  public generos$ = this.generosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl).pipe(
      tap(generos => this.generosSubject.next(generos))
    );
  }

  getById(id: string): Observable<Genero> {
    return this.http.get<Genero>(`${this.apiUrl}/${id}`);
  }

  create(genero: GeneroDto): Observable<Genero> {
    return this.http.post<Genero>(this.apiUrl, genero).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: string, genero: GeneroDto): Observable<Genero> {
    return this.http.put<Genero>(`${this.apiUrl}/${id}`, genero).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
