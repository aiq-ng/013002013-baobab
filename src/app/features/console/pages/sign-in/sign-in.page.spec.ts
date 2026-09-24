import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SignInPage } from './sign-in.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';

describe('SignInPage', () => {
  let fixture: ComponentFixture<SignInPage>;
  let store: { signIn: ReturnType<typeof vi.fn> };
  let el: HTMLElement;

  const query = <T extends Element = HTMLElement>(selector: string): T | null =>
    el.querySelector<T>(selector);

  function fill(email: string, password: string): void {
    const emailInput = query<HTMLInputElement>('#email')!;
    const passwordInput = query<HTMLInputElement>('#password')!;
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));
  }

  function submit(): void {
    query<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    store = { signIn: vi.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [SignInPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders the green admin logo rather than the white site logo', () => {
    const logo = query<HTMLImageElement>('img')!;
    expect(logo.getAttribute('src')).toContain('logo-admin.png');
    expect(logo.getAttribute('alt')).toBe('Baobab');
  });

  it('renders the heading and subtitle copy from the design', () => {
    expect(query('h1')!.textContent).toContain('Sign in to Baobab Admin');
    expect(el.textContent).toContain('Secretariat dispatch, Programs & Resources management.');
  });

  it('shows the design placeholder on the email field', () => {
    expect(query<HTMLInputElement>('#email')!.placeholder).toBe('liaison@baobab-statecraft.org');
  });

  it('toggles password visibility with an accessible button', () => {
    const password = query<HTMLInputElement>('#password')!;
    const toggle = query<HTMLButtonElement>('[data-testid="password-toggle"]')!;
    expect(password.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    toggle.click();
    fixture.detectChanges();

    expect(password.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('reveals password-reset guidance when "Forgot your password?" is pressed', () => {
    const link = query<HTMLButtonElement>('[data-testid="forgot-password"]')!;
    expect(link.textContent).toContain('Forgot your password?');
    expect(link.getAttribute('aria-expanded')).toBe('false');
    expect(query('#forgot-password-help')).toBeNull();

    link.click();
    fixture.detectChanges();

    expect(link.getAttribute('aria-expanded')).toBe('true');
    expect(query('#forgot-password-help')!.textContent).toContain('administrator');
  });

  it('shows field errors and does not call the store when submitted empty', () => {
    submit();

    expect(store.signIn).not.toHaveBeenCalled();
    expect(query('#email-error')!.textContent).toContain('Enter your email address.');
    expect(query('#password-error')!.textContent).toContain('Enter your password.');
    expect(query('#email')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('flags a malformed email address', () => {
    fill('not-an-email', 'secret');
    submit();

    expect(store.signIn).not.toHaveBeenCalled();
    expect(query('#email-error')!.textContent).toContain('Enter a valid email address.');
  });

  it('signs in and navigates to the submissions queue', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fill('liaison@baobab-statecraft.org', 'secret');
    submit();
    await fixture.whenStable();

    expect(store.signIn).toHaveBeenCalledWith('liaison@baobab-statecraft.org', 'secret');
    expect(navigate).toHaveBeenCalledWith('/console/submissions');
  });

  it('shows an error when the credentials are rejected', async () => {
    store.signIn.mockRejectedValue(new Error('401'));
    fill('liaison@baobab-statecraft.org', 'wrong');
    submit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(query('[data-testid="sign-in-error"]')!.textContent).toContain(
      'Incorrect email or password.',
    );
  });
});
