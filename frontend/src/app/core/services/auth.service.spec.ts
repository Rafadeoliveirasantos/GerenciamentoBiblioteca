import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const credenciais = { username: 'admin', password: 'Admin@123' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(credenciais).subscribe(response => {
      expect(response.token).toBe('fake-jwt-token');
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credenciais);
    req.flush(mockResponse);
  });

  it('should logout and remove token', () => {
    localStorage.setItem('token', 'fake-token');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return true when authenticated', () => {
    localStorage.setItem('token', 'fake-token');

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when not authenticated', () => {
    localStorage.removeItem('token');

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('token', 'my-token');

    expect(service.obterToken()).toBe('my-token');
  });

  it('should return null when no token exists', () => {
    expect(service.obterToken()).toBeNull();
  });
});
