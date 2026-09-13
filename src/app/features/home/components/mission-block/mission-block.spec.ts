import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionBlock } from './mission-block';

describe('MissionBlock', () => {
  let fixture: ComponentFixture<MissionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionBlock],
    }).compileComponents();
    fixture = TestBed.createComponent(MissionBlock);
    fixture.detectChanges();
  });

  it('renders the eyebrow badge and heading from the design export', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('KNOW ABOUT US');
    expect(el.textContent).toContain(
      'We provide an ancestral sanctuary for sovereign dialogue and restorative justice.',
    );
  });

  it('renders a real download link for the doctrine summary, not a dead-click button', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href]');
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Download Doctrine Summary');
  });

  it('renders the revision caption next to the CTA', () => {
    expect(fixture.nativeElement.textContent).toContain('Rev. 2025/S Sahel Mandate');
  });
});
