import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastContainer } from './toast-container';
import { ToastService } from './toast.service';

describe('ToastContainer', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [ToastContainer] });
    const fixture = TestBed.createComponent(ToastContainer);
    const toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
    return { fixture, toastService };
  }

  it('renders an aria-live polite region', () => {
    const { fixture } = setup();
    const region = fixture.debugElement.query(By.css('[aria-live="polite"]'));
    expect(region).toBeTruthy();
  });

  it('renders a toast pushed via the service', () => {
    const { fixture, toastService } = setup();
    toastService.success('Saved.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Saved.');
  });

  it('dismisses a toast when its close button is clicked', () => {
    const { fixture, toastService } = setup();
    toastService.error('Something failed.');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[aria-label="Dismiss"]')).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Something failed.');
  });

  it('renders multiple toasts independently', () => {
    const { fixture, toastService } = setup();
    toastService.success('First.');
    toastService.error('Second.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('First.');
    expect(fixture.nativeElement.textContent).toContain('Second.');
  });
});
