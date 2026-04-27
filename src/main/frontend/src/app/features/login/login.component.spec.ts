import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

// Stub component so provideRouter has a real route for /boats
@Component({ standalone: true, template: '' })
class BoatsStubComponent {}

function createAuthServiceMock(loginReturnValue = true) {
  return {
    login: jest.fn().mockReturnValue(loginReturnValue),
    logout: jest.fn(),
    isAuthenticated: false,
    user: jest.fn().mockReturnValue(null),
  };
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authMock: ReturnType<typeof createAuthServiceMock>;
  let router: Router;

  async function setup(loginReturnValue = true) {
    authMock = createAuthServiceMock(loginReturnValue);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([{ path: 'boats', component: BoatsStubComponent }]),
        provideAnimationsAsync(),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }

  function getByRole(role: string, name?: string) {
    const all = fixture.nativeElement.querySelectorAll(`[role="${role}"]`);
    if (!name) return all[0] as HTMLElement | undefined;
    return Array.from(all).find(
      (el) => (el as HTMLElement).textContent?.includes(name),
    ) as HTMLElement | undefined;
  }

  function getInput(label: string) {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    const matFields = fixture.nativeElement.querySelectorAll('mat-form-field');
    for (const field of Array.from(matFields)) {
      if ((field as HTMLElement).textContent?.includes(label)) {
        return (field as HTMLElement).querySelector('input') as HTMLInputElement;
      }
    }
    return null;
  }

  function typeInto(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  async function submitForm(username: string, password: string) {
    const usernameInput = getInput('Username')!;
    const passwordInput = getInput('Password')!;
    typeInto(usernameInput, username);
    typeInto(passwordInput, password);
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('rendering', () => {
    beforeEach(async () => setup());

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render the brand name "BoatFleet"', () => {
      expect(fixture.nativeElement.textContent).toContain('BoatFleet');
    });

    it('should render a username input with label', () => {
      const input = getInput('Username');
      expect(input).not.toBeNull();
    });

    it('should render a password input of type password by default', () => {
      const input = getInput('Password');
      expect(input?.type).toBe('password');
    });

    it('should render a Sign In button', () => {
      const btn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(btn).not.toBeNull();
      expect(btn.textContent.trim()).toContain('Sign In');
    });

    it('should not show an error message initially', () => {
      expect(fixture.nativeElement.textContent).not.toContain('Invalid credentials');
    });
  });

  describe('password visibility toggle', () => {
    beforeEach(async () => setup());

    it('should toggle password input type when visibility button is clicked', () => {
      const passwordInput = getInput('Password')!;
      expect(passwordInput.type).toBe('password');

      const toggleBtns = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
      const visibilityBtn = toggleBtns.find(b =>
        b.nativeElement.textContent?.includes('visibility'),
      );
      visibilityBtn?.nativeElement.click();
      fixture.detectChanges();

      expect(passwordInput.type).toBe('text');
    });
  });

  describe('form validation', () => {
    beforeEach(async () => setup());

    it('should show validation error when username is empty and form is submitted', async () => {
      await submitForm('', 'password');

      expect(fixture.nativeElement.textContent).toContain('Username is required');
    });

    it('should show validation error when password is empty and form is submitted', async () => {
      await submitForm('admin', '');

      expect(fixture.nativeElement.textContent).toContain('Password is required');
    });

    it('should not call AuthService.login when form is invalid', async () => {
      await submitForm('', '');

      expect(authMock.login).not.toHaveBeenCalled();
    });
  });

  describe('successful login', () => {
    beforeEach(async () => setup(true));

    it('should call AuthService.login with entered credentials', async () => {
      await submitForm('admin', 'secret');

      expect(authMock.login).toHaveBeenCalledWith('admin', 'secret');
    });

    it('should navigate to /boats on successful login', async () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      await submitForm('admin', 'secret');

      expect(navigateSpy).toHaveBeenCalledWith(['/boats']);
    });
  });

  describe('failed login', () => {
    beforeEach(async () => setup(false));

    it('should display an error message when login fails', async () => {
      await submitForm('admin', 'wrongpass');

      expect(fixture.nativeElement.textContent).toContain('Invalid credentials');
    });

    it('should not navigate when login fails', async () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      await submitForm('admin', 'wrong');

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => setup());

    it('should have a form element', () => {
      expect(fixture.nativeElement.querySelector('form')).not.toBeNull();
    });

    it('should have labels for the username and password fields', () => {
      const labels = fixture.nativeElement.querySelectorAll('mat-label');
      const texts = Array.from(labels).map((l) => (l as HTMLElement).textContent?.trim());
      expect(texts).toContain('Username');
      expect(texts).toContain('Password');
    });

    it('should have a submit button that is keyboard-accessible (type=submit)', () => {
      const submit = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submit).not.toBeNull();
    });
  });
});
