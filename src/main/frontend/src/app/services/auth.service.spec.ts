import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => sessionStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be authenticated when no session exists', () => {
      expect(service.isAuthenticated).toBe(false);
      expect(service.user()).toBeNull();
    });

    it('should restore session from sessionStorage on init', () => {
      sessionStorage.setItem('auth_user', JSON.stringify({ username: 'restored' }));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(AuthService);

      expect(freshService.isAuthenticated).toBe(true);
      expect(freshService.user()?.username).toBe('restored');
    });

    it('should handle corrupted sessionStorage gracefully', () => {
      sessionStorage.setItem('auth_user', 'not-valid-json{{{');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(AuthService);

      expect(freshService.isAuthenticated).toBe(false);
      expect(freshService.user()).toBeNull();
    });
  });

  describe('login()', () => {
    it('should return true and set user signal on valid credentials', () => {
      const result = service.login('admin', 'password');

      expect(result).toBe(true);
      expect(service.isAuthenticated).toBe(true);
      expect(service.user()?.username).toBe('admin');
    });

    it('should persist user to sessionStorage on login', () => {
      service.login('captain', 'secret');

      const stored = JSON.parse(sessionStorage.getItem('auth_user')!);
      expect(stored.username).toBe('captain');
    });

    it('should return false when username is empty', () => {
      const result = service.login('', 'password');

      expect(result).toBe(false);
      expect(service.isAuthenticated).toBe(false);
    });

    it('should return false when password is empty', () => {
      const result = service.login('admin', '');

      expect(result).toBe(false);
      expect(service.isAuthenticated).toBe(false);
    });

    it('should return false when both credentials are empty', () => {
      const result = service.login('', '');

      expect(result).toBe(false);
    });

    it('should accept any non-empty username/password combination', () => {
      expect(service.login('x', 'y')).toBe(true);
    });
  });

  describe('logout()', () => {
    it('should clear user signal and sessionStorage on logout', () => {
      service.login('admin', 'pass');
      service.logout();

      expect(service.isAuthenticated).toBe(false);
      expect(service.user()).toBeNull();
      expect(sessionStorage.getItem('auth_user')).toBeNull();
    });

    it('should be idempotent — calling logout twice does not throw', () => {
      expect(() => {
        service.logout();
        service.logout();
      }).not.toThrow();
    });
  });

  describe('user signal reactivity', () => {
    it('should update user signal after login', () => {
      expect(service.user()).toBeNull();

      service.login('sailor', 'anchor');

      expect(service.user()).toEqual({ username: 'sailor' });
    });

    it('should reset user signal to null after logout', () => {
      service.login('sailor', 'anchor');
      service.logout();

      expect(service.user()).toBeNull();
    });
  });
});
