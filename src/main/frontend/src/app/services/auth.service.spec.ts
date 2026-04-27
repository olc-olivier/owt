import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  function flushMe(status = 401) {
    const req = httpMock.expectOne('/api/auth/me');
    req.flush({ error: 'Not authenticated' }, { status, statusText: 'Unauthorized' });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    flushMe();
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be authenticated before /me resolves', () => {
      expect(service.isAuthenticated).toBe(false);
      expect(service.user()).toBeNull();
      flushMe();
    });

    it('should restore session when /me returns a user', fakeAsync(() => {
      const req = httpMock.expectOne('/api/auth/me');
      req.flush({ username: 'restored', authenticated: true, roles: ['ROLE_USER'] });
      tick();

      expect(service.isAuthenticated).toBe(true);
      expect(service.user()?.username).toBe('restored');
    }));

    it('should remain unauthenticated when /me returns 401', fakeAsync(() => {
      flushMe(401);
      tick();

      expect(service.isAuthenticated).toBe(false);
      expect(service.user()).toBeNull();
    }));

    it('should emit on sessionReady$ after /me completes', fakeAsync(() => {
      let emitted = false;
      service.sessionReady$.subscribe(() => (emitted = true));
      flushMe();
      tick();

      expect(emitted).toBe(true);
    }));
  });

  describe('login()', () => {
    beforeEach(() => flushMe());

    it('should return true and set user signal on success', fakeAsync(() => {
      let result: boolean | undefined;
      service.login('admin', 'password').subscribe(ok => (result = ok));

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'admin', password: 'password' });
      req.flush({ username: 'admin', authenticated: true, roles: ['ROLE_ADMIN'] });
      tick();

      expect(result).toBe(true);
      expect(service.isAuthenticated).toBe(true);
      expect(service.user()?.username).toBe('admin');
    }));

    it('should return false and clear user on 401', fakeAsync(() => {
      let result: boolean | undefined;
      service.login('admin', 'wrong').subscribe(ok => (result = ok));

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ error: 'Invalid' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      expect(result).toBe(false);
      expect(service.isAuthenticated).toBe(false);
    }));
  });

  describe('logout()', () => {
    it('should clear user signal and call /api/auth/logout', fakeAsync(() => {
      // Restore session first
      const meReq = httpMock.expectOne('/api/auth/me');
      meReq.flush({ username: 'admin', authenticated: true, roles: [] });
      tick();

      service.logout();

      const logoutReq = httpMock.expectOne('/api/auth/logout');
      expect(logoutReq.request.method).toBe('POST');
      logoutReq.flush({});

      expect(service.isAuthenticated).toBe(false);
      expect(service.user()).toBeNull();
    }));

    it('should be idempotent — calling logout twice does not throw', fakeAsync(() => {
      flushMe();
      tick();

      expect(() => {
        service.logout();
        const r1 = httpMock.expectOne('/api/auth/logout');
        r1.flush({});
        service.logout();
        const r2 = httpMock.expectOne('/api/auth/logout');
        r2.flush({});
      }).not.toThrow();
    }));
  });

  describe('user signal reactivity', () => {
    it('should update user signal after successful login', fakeAsync(() => {
      flushMe();
      expect(service.user()).toBeNull();

      service.login('sailor', 'anchor').subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ username: 'sailor', authenticated: true, roles: [] });
      tick();

      expect(service.user()).toEqual({ username: 'sailor', roles: [] });
    }));

    it('should reset user signal to null after logout', fakeAsync(() => {
      const meReq = httpMock.expectOne('/api/auth/me');
      meReq.flush({ username: 'sailor', authenticated: true, roles: [] });
      tick();

      service.logout();
      const logoutReq = httpMock.expectOne('/api/auth/logout');
      logoutReq.flush({});

      expect(service.user()).toBeNull();
    }));
  });
});
