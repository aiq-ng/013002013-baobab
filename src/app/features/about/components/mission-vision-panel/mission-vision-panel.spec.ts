import { TestBed } from '@angular/core/testing';
import { MissionVisionPanel } from './mission-vision-panel';

describe('MissionVisionPanel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MissionVisionPanel] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(MissionVisionPanel);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the mission and vision statements from the design export', () => {
    const fixture = TestBed.createComponent(MissionVisionPanel);
    fixture.detectChanges();
    const headings = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('h2')).map(
      (h) => h.textContent?.trim(),
    );
    expect(fixture.nativeElement.textContent).toContain('OUR MISSION');
    expect(fixture.nativeElement.textContent).toContain('OUR VISION');
    expect(headings).toEqual([
      'To strengthen peace and stability across West Africa by facilitating sovereign-led dialogue.',
      'A peaceful, resilient and prosperous West Africa',
    ]);
    expect(fixture.nativeElement.textContent).toContain(
      'where governments, communities and legitimate institutions work together',
    );
  });
});
