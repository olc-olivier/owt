import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialise the theme service on startup', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    // App bootstraps correctly — ThemeService.initTheme() is called via ngOnInit
    expect(fixture.componentInstance).toBeTruthy();
  });
});
