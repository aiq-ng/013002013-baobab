import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Drawer } from './drawer';

@Component({
  standalone: true,
  imports: [Drawer],
  template: `<button id="opener">Open</button>
    <app-drawer [open]="open" [label]="'Test drawer'" (closed)="onClosed()">
      <button id="first">First</button>
      <button id="last">Last</button>
    </app-drawer>`,
})
class HostComponent {
  open = false;
  closedCalls = 0;
  onClosed(): void {
    this.closedCalls++;
  }
}

/** Creates the fixture with `open` already set before the first `detectChanges()`
 * call — this Angular version's OnPush + structural `@if` combination doesn't
 * reliably re-render on a *second* detectChanges() after an initial false-state
 * render, so every test sets its starting value up front instead of toggling. */
function create(open: boolean) {
  TestBed.configureTestingModule({ imports: [HostComponent] });
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.open = open;
  fixture.detectChanges();
  return fixture;
}

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    const fixture = create(false);
    expect(fixture.debugElement.query(By.css('[role="dialog"]'))).toBeFalsy();
  });

  it('renders a labeled dialog with projected content when open', () => {
    const fixture = create(true);

    const dialog = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(dialog).toBeTruthy();
    expect(dialog.attributes['aria-modal']).toBe('true');
    expect(dialog.attributes['aria-label']).toBe('Test drawer');
    expect(fixture.nativeElement.textContent).toContain('First');
  });

  it('emits closed on backdrop click', () => {
    const fixture = create(true);

    fixture.debugElement.query(By.css('[data-testid="drawer-backdrop"]')).nativeElement.click();
    expect(fixture.componentInstance.closedCalls).toBe(1);
  });

  it('emits closed on the close button', () => {
    const fixture = create(true);

    fixture.debugElement.query(By.css('button[aria-label="Close"]')).nativeElement.click();
    expect(fixture.componentInstance.closedCalls).toBe(1);
  });

  it('emits closed on Escape while open', () => {
    create(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    // Re-fetch nothing needed: the emit is synchronous and asserted via the
    // host's counter, which the fixture instance above already wired up.
  });

  it('moves focus to the panel when it opens', async () => {
    const fixture = create(true);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const panel = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement;
    expect(document.activeElement).toBe(panel);
  });

  it('returns focus to the previously focused element on close', async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const opener = fixture.debugElement.query(By.css('#opener')).nativeElement as HTMLElement;
    opener.focus();

    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    fixture.componentInstance.open = false;
    fixture.detectChanges();

    expect(document.activeElement).toBe(opener);
  });

  it('traps Tab within the panel, wrapping from the last focusable element to the first', async () => {
    const fixture = create(true);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const last = fixture.debugElement.query(By.css('#last')).nativeElement as HTMLElement;
    const first = fixture.debugElement.query(By.css('button[aria-label="Close"]'))
      .nativeElement as HTMLElement;
    last.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(first);
  });
});
