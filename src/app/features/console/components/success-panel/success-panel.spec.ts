import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SuccessPanel } from './success-panel';

@Component({
  standalone: true,
  imports: [SuccessPanel],
  template: `<app-console-success-panel
    eyebrow="Program updated"
    title="Program Updated & Published"
    tag="Batch 004"
  >
    <p><strong>Liptako</strong> updates are confirmed.</p>
    <a actions href="/console/programs">Return</a>
  </app-console-success-panel>`,
})
class Host {}

describe('SuccessPanel', () => {
  async function setup(): Promise<HTMLElement> {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    return fixture.nativeElement;
  }

  it('renders the design copy slots', async () => {
    const el = await setup();
    expect(el.textContent).toContain('Program updated');
    expect(el.querySelector('h1')?.textContent).toContain('Program Updated & Published');
    expect(el.textContent).toContain('Batch 004');
    expect(el.textContent).toContain('updates are confirmed');
    expect(el.querySelector('a')?.textContent).toContain('Return');
  });

  it('moves focus to its heading so the outcome is announced', async () => {
    const el = await setup();
    expect(document.activeElement).toBe(el.querySelector('h1'));
  });
});
