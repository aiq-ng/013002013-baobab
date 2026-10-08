import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MissionBlock } from './mission-block';

describe('MissionBlock', () => {
  let fixture: ComponentFixture<MissionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionBlock],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(MissionBlock);
    fixture.detectChanges();
  });

  it('renders the eyebrow and heading from the design export', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('WHO WE ARE');
    expect(el.textContent).toContain('We work across ECOWAS and AES countries.');
  });

  it('renders the "who we are" body copy', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'support sovereign dialogue, community resilience and hybrid mediation',
    );
  });

  it('renders an "About Us" CTA routed to the About page', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const about = links.find((a) => a.textContent!.includes('About Us'));
    expect(about!.getAttribute('href')).toBe('/about');
  });
});
