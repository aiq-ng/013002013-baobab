import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { SuccessModal } from './success-modal';
import { SuccessModalService } from '../services/success-modal.service';

describe('SuccessModal', () => {
  let service: SuccessModalService;
  let fixture: ReturnType<typeof TestBed.createComponent<SuccessModal>>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuccessModal],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(SuccessModal);
    service = TestBed.inject(SuccessModalService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('renders nothing when there is no active submission', () => {
    expect(fixture.debugElement.query(By.css('[role="dialog"]'))).toBeFalsy();
  });

  it('shows the reference id and source-specific copy when a submission is active', () => {
    service.show('partnerships-dialogue', 'BG-2026-0847');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Your message has been sent');
    expect(text).toContain('BG-2026-0847');
  });

  it('falls back to generic copy for an unrecognized source', () => {
    service.show('contact-form', 'BB-1');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Message received');
  });

  it('closes and navigates home when the primary CTA is pressed', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    service.show('contact-form', 'BB-1');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[type="button"].w-full')).nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(service.current()).toBeNull();
  });

  it('closes without navigating when dismissed via the close control', () => {
    service.show('contact-form', 'BB-1');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[aria-label="Close"]')).nativeElement.click();
    fixture.detectChanges();

    expect(service.current()).toBeNull();
    expect(fixture.debugElement.query(By.css('[role="dialog"]'))).toBeFalsy();
  });
});
