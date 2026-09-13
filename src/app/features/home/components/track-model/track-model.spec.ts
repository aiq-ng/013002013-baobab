import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackModel } from './track-model';

describe('TrackModel', () => {
  let fixture: ComponentFixture<TrackModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackModel],
    }).compileComponents();
    fixture = TestBed.createComponent(TrackModel);
    fixture.detectChanges();
  });

  it('renders the section heading and intro copy', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('SOVEREIGNTY MATRIX');
    expect(el.textContent).toContain('The Track 1.5 Architecture Model');
  });

  it('renders all 3 tracks with Track 1.5 as the emphasized center pivot', () => {
    expect(fixture.componentInstance.tracks.length).toBe(3);
    expect(fixture.componentInstance.tracks[1].emphasized).toBe(true);
    expect(fixture.componentInstance.tracks[0].emphasized).toBe(false);
    expect(fixture.componentInstance.tracks[2].emphasized).toBe(false);
  });

  it('renders both capability and limitation items for the Track 1 card', () => {
    const track1 = fixture.componentInstance.tracks[0];
    expect(track1.capabilities).toContain('Binding constitutional ratification');
    expect(track1.limitations).toContain('Restricted from non-state armed contact');
  });
});
