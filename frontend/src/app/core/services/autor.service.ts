import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Autor, AutorDto } from '../models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private readonly apiUrl = `${environment.apiUrl}/autores`;
  private autoresSubject = new BehaviorSubject<Autor[]>([]);
  public autores$ = this.autoresSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl).pipe(
      tap(autores => this.autoresSubject.next(autores))
    );
  }

  getById(id: string): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }

  create(autor: AutorDto): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, autor).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  update(id: string, autor: AutorDto): Observable<Autor> {
    return this.http.put<Autor>(`${this.apiUrl}/${id}`, autor).pipe(
      tap(() => this.getAll().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAll().subscribe())
    );
  }
}
