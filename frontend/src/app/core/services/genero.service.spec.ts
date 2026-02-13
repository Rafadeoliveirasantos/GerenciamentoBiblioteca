import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeneroService } from './genero.service';
import { Genero } from '../models/genero.model';
import { environment } from '../../../environments/environment';

describe('GeneroService', () => {
  let service: GeneroService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/generos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneroService]
    });
    service = TestBed.inject(GeneroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all generos via GET', () => {
    const mockGeneros: Genero[] = [
      { id: '1', nome: 'Romance', descricao: 'Livros de romance' },
      { id: '2', nome: 'Suspense', descricao: 'Thrillers e mistérios' }
    ];

    service.getAll().subscribe(generos => {
      expect(generos.length).toBe(2);
      expect(generos[0].nome).toBe('Romance');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockGeneros);
  });

  it('should fetch genero by id via GET', () => {
    const mockGenero: Genero = { id: '1', nome: 'Romance' };

    service.getById('1').subscribe(genero => {
      expect(genero.nome).toBe('Romance');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGenero);
  });

  it('should create genero via POST', () => {
    const dto = { nome: 'Terror', descricao: 'Livros de terror' };
    const mockResponse: Genero = { id: '3', nome: 'Terror', descricao: 'Livros de terror' };

    service.create(dto).subscribe(genero => {
      expect(genero.nome).toBe('Terror');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should update genero via PUT', () => {
    const dto = { nome: 'Atualizado', descricao: 'Nova desc' };
    const mockResponse: Genero = { id: '1', nome: 'Atualizado', descricao: 'Nova desc' };

    service.update('1', dto).subscribe(genero => {
      expect(genero.nome).toBe('Atualizado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should delete genero via DELETE', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });
});
