import { TestBed } from '@angular/core/testing';
import { ConfirmDialogHost } from './confirm-dialog-host';
import { ConfirmService } from './confirm.service';

describe('ConfirmDialogHost', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [ConfirmDialogHost] });
    const fixture = TestBed.createComponent(ConfirmDialogHost);
    const service = TestBed.inject(ConfirmService);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, service, el };
  }

  it('renders nothing until asked', () => {
    const { el } = setup();
    expect(el.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it('renders an alertdialog labelled by its title and described by its message', () => {
    const { fixture, service, el } = setup();
    void service.ask({ title: 'Delete entry?', message: 'This cannot be undone.', tone: 'danger' });
    fixture.detectChanges();

    const dialog = el.querySelector('[role="alertdialog"]')!;
    const labelledBy = dialog.getAttribute('aria-labelledby')!;
    const describedBy = dialog.getAttribute('aria-describedby')!;
    expect(el.querySelector(`#${labelledBy}`)?.textContent).toContain('Delete entry?');
    expect(el.querySelector(`#${describedBy}`)?.textContent).toContain('This cannot be undone.');
  });

  it('puts initial focus on the safe choice (cancel) for destructive actions', () => {
    const { fixture, service, el } = setup();
    void service.ask({ title: 'Delete?', message: '', tone: 'danger', cancelLabel: 'Keep' });
    fixture.detectChanges();

    const cancel = el.querySelector('[data-testid="confirm-cancel"]')!;
    expect(cancel.hasAttribute('data-autofocus')).toBe(true);
    expect(el.querySelector('[data-testid="confirm-accept"]')!.hasAttribute('data-autofocus')).toBe(
      false,
    );
  });

  it('resolves true on confirm and false on cancel', async () => {
    const { fixture, service, el } = setup();
    const yes = service.ask({ title: 'A', message: '', confirmLabel: 'Delete' });
    fixture.detectChanges();
    (el.querySelector('[data-testid="confirm-accept"] button') as HTMLButtonElement).click();
    expect(await yes).toBe(true);

    const no = service.ask({ title: 'B', message: '' });
    fixture.detectChanges();
    (el.querySelector('[data-testid="confirm-cancel"] button') as HTMLButtonElement).click();
    expect(await no).toBe(false);
  });

  it('treats Escape as cancel', async () => {
    const { fixture, service } = setup();
    const answer = service.ask({ title: 'A', message: '' });
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(await answer).toBe(false);
  });
});
