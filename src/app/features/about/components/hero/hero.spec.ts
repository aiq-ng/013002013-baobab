import { TestBed } from '@angular/core/testing';
import { AboutHero } from './hero';

describe('AboutHero', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AboutHero] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(AboutHero);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the eyebrow, headline, and intro copy from the design export', () => {
    const fixture = TestBed.createComponent(AboutHero);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('ABOUT US');
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(
      'An African-led institution for peace and dialogue.',
    );
    expect(el.textContent).toContain(
      'The Baobab Group is a pan-West African peacebuilding and mediation institution.',
    );
  });
});
