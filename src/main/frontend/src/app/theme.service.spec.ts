import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-theme');

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should start with dark mode off', () => {
    expect(service.isDarkMode()).toBeFalse();
  });

  describe('toggleTheme()', () => {
    it('adds .dark to <html> and .dark-theme to <body>', () => {
      service.toggleTheme();
      expect(document.documentElement.classList).toContain('dark');
      expect(document.body.classList).toContain('dark-theme');
    });

    it('removes classes when toggling back', () => {
      service.toggleTheme();
      service.toggleTheme();
      expect(document.documentElement.classList).not.toContain('dark');
      expect(document.body.classList).not.toContain('dark-theme');
    });

    it('persists preference to localStorage', () => {
      service.toggleTheme();
      expect(localStorage.getItem('theme')).toBe('dark');

      service.toggleTheme();
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('updates isDarkMode signal', () => {
      service.toggleTheme();
      expect(service.isDarkMode()).toBeTrue();
    });
  });

  describe('initTheme()', () => {
    it('restores dark mode from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      service.initTheme();
      expect(service.isDarkMode()).toBeTrue();
      expect(document.documentElement.classList).toContain('dark');
    });

    it('restores light mode from localStorage', () => {
      localStorage.setItem('theme', 'light');
      service.initTheme();
      expect(service.isDarkMode()).toBeFalse();
    });

    it('falls back to matchMedia when no localStorage entry', () => {
      const original = window.matchMedia;
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

      service.initTheme();
      expect(service.isDarkMode()).toBeTrue();

      window.matchMedia = original;
    });
  });
});
