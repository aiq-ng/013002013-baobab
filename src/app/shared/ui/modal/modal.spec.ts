import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Modal } from './modal';

@Component({
  standalone: true,
  imports: [Modal],
  template: `<app-modal [open]="open" [label]="'Test dialog'" (closed)="onClosed()">
    <p>Modal body content</p>
  </app-modal>`,
})
class HostComponent {
  open = false;
  closedCalls = 0;
  onClosed(): void {
    this.closedCalls++;
  }
}

describe('Modal', () => {
  it('renders nothing when closed', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="dialog"]'))).toBeFalsy();
  });

  it('renders projected content with dialog role when open', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(dialog).toBeTruthy();
    expect(dialog.attributes['aria-modal']).toBe('true');
    expect(dialog.attributes['aria-label']).toBe('Test dialog');
    expect(fixture.nativeElement.textContent).toContain('Modal body content');
  });

  it('emits closed when the backdrop is clicked', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('[data-testid="modal-backdrop"]')).nativeElement.click();
    expect(fixture.componentInstance.closedCalls).toBe(1);
  });

  it('emits closed when the close button is activated', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[aria-label="Close"]')).nativeElement.click();
    expect(fixture.componentInstance.closedCalls).toBe(1);
  });

  it('emits closed on Escape keydown', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(fixture.componentInstance.closedCalls).toBe(1);
  });

  describe('focus management', () => {
    @Component({
      standalone: true,
      imports: [Modal],
      template: `<button id="opener">Open</button>
        <app-modal [open]="open" label="Focus dialog" (closed)="open = false">
          <button id="first">First</button>
          <button id="preferred" data-autofocus>Preferred</button>
        </app-modal>`,
    })
    class FocusHost {
      open = false;
    }

    const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

    it('moves focus to the [data-autofocus] element when it opens', async () => {
      TestBed.configureTestingModule({ imports: [FocusHost] });
      const fixture = TestBed.createComponent(FocusHost);
      fixture.componentInstance.open = true;
      fixture.detectChanges();
      await tick();

      expect(document.activeElement?.id).toBe('preferred');
    });

    it('traps Tab inside the dialog', async () => {
      TestBed.configureTestingModule({ imports: [FocusHost] });
      const fixture = TestBed.createComponent(FocusHost);
      fixture.componentInstance.open = true;
      fixture.detectChanges();
      await tick();

      const close = fixture.debugElement.query(By.css('button[aria-label="Close"]'))
        .nativeElement as HTMLElement;
      (fixture.debugElement.query(By.css('#preferred')).nativeElement as HTMLElement).focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(document.activeElement).toBe(close);
    });

    it('returns focus to whatever opened it when it closes', async () => {
      TestBed.configureTestingModule({ imports: [FocusHost] });
      const fixture = TestBed.createComponent(FocusHost);
      fixture.detectChanges();
      const opener = fixture.debugElement.query(By.css('#opener')).nativeElement as HTMLElement;
      opener.focus();

      fixture.componentInstance.open = true;
      fixture.detectChanges();
      await tick();
      fixture.componentInstance.open = false;
      fixture.detectChanges();

      expect(document.activeElement).toBe(opener);
    });
  });
});
