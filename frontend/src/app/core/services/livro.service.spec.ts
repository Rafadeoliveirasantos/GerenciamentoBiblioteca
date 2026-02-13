import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LivroService } from './livro.service';
import { Livro } from '../models/livro.model';
import { environment } from '../../../environments/environment';

describe('LivroService', () => {
  let service: LivroService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/livros`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LivroService]
    });
    service = TestBed.inject(LivroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all livros via GET', () => {
    const mockLivros: Livro[] = [
      { id: '1', titulo: 'Livro 1', isbn: '111', anoPublicacao: 2020, autorId: 'a1', autorNome: 'Autor 1', generoId: 'g1', generoNome: 'Romance' },
      { id: '2', titulo: 'Livro 2', isbn: '222', anoPublicacao: 2021, autorId: 'a2', autorNome: 'Autor 2', generoId: 'g2', generoNome: 'Suspense' }
    ];

    service.getAll().subscribe(livros => {
      expect(livros.length).toBe(2);
      expect(livros[0].titulo).toBe('Livro 1');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLivros);
  });

  it('should fetch livro by id via GET', () => {
    const mockLivro: Livro = { id: '1', titulo: 'Teste', isbn: '123', anoPublicacao: 2020, autorId: 'a1', autorNome: 'Autor', generoId: 'g1', generoNome: 'Romance' };

    service.getById('1').subscribe(livro => {
      expect(livro.titulo).toBe('Teste');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLivro);
  });

  it('should create livro via POST', () => {
    const dto = { titulo: 'Novo', isbn: '999', anoPublicacao: 2023, autorId: 'a1', generoId: 'g1' };
    const mockResponse: Livro = { id: '3', titulo: 'Novo', isbn: '999', anoPublicacao: 2023, autorId: 'a1', autorNome: 'Autor', generoId: 'g1', generoNome: 'Romance' };

    service.create(dto).subscribe(livro => {
      expect(livro.titulo).toBe('Novo');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should update livro via PUT', () => {
    const dto = { titulo: 'Atualizado', isbn: '111', anoPublicacao: 2024, autorId: 'a1', generoId: 'g1' };
    const mockResponse: Livro = { id: '1', titulo: 'Atualizado', isbn: '111', anoPublicacao: 2024, autorId: 'a1', autorNome: 'Autor', generoId: 'g1', generoNome: 'Romance' };

    service.update('1', dto).subscribe(livro => {
      expect(livro.titulo).toBe('Atualizado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should delete livro via DELETE', () => {
    service.delete('1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should upload capa via POST with FormData', () => {
    const mockFile = new File([''], 'capa.jpg', { type: 'image/jpeg' });
    const mockResponse = { capaUrl: '/uploads/capas/capa.jpg' };

    service.uploadCapa('1', mockFile).subscribe(result => {
      expect(result.capaUrl).toBe('/uploads/capas/capa.jpg');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/capa`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush(mockResponse);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });

  it('should remover capa via DELETE', () => {
    service.removerCapa('1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/capa`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const refreshReq = httpMock.expectOne(apiUrl);
    refreshReq.flush([]);
  });
});
