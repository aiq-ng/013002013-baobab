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

  it('renders the mission and vision panels', () => {
    const fixture = TestBed.createComponent(MissionVisionPanel);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('OUR MISSION');
    expect(text).toContain('inclusive statecraft');
    expect(text).toContain('OUR VISION');
    expect(text).toContain('enduring sovereign autonomy');
  });
});
