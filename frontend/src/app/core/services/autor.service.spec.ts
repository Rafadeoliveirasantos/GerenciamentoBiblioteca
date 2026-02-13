import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AutorService } from './autor.service';
import { Autor } from '../models/autor.model';
import { environment } from '../../../environments/environment';

describe('AutorService', () => {
  let service: AutorService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/autores`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutorService]
    });
    service = TestBed.inject(AutorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all autores via GET', () => {
    const mockAutores: Autor[] = [
      { id: '1', nome: 'John Green', biografia: 'Escritor americano' },
      { id: '2', nome: 'Machado de Assis', biografia: 'Escritor brasileiro' }
    ];

    service.getAll().subscribe(autores => {
      expect(autores.length).toBe(2);
      expect(autores[0].nome).toBe('John Green');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAutores);
  });

  it('should fetch autor by id via GET', () => {
    const mockAutor: Autor = { id: '1', nome: 'John Green' };

    service.getById('1').subscribe(autor => {
      expect(autor.nome).toBe('John Green');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAutor);
  });

  it('should create autor via POST', () => {
    const dto = { nome: 'Novo Autor', biografia: 'Bio' };
    const mockResponse: Autor = { id: '3', nome: 'Novo Autor', biografia: 'Bio' };

    service.create(dto).subscribe(autor => {
      expect(autor.nome).toBe('Novo Autor');
    });

    // POST request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);

    // tap triggers getAll
    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should update autor via PUT', () => {
    const dto = { nome: 'Atualizado' };
    const mockResponse: Autor = { id: '1', nome: 'Atualizado' };

    service.update('1', dto).subscribe(autor => {
      expect(autor.nome).toBe('Atualizado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should delete autor via DELETE', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });
});
