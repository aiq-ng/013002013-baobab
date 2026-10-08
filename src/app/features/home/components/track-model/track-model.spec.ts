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

  it('renders the "Our response" heading and intro copy', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('SOVEREIGNTY MATRIX');
    expect(el.textContent).toContain('Our response');
    expect(el.textContent).toContain('Our response is a dual-track peace architecture.');
  });

  it('renders the 3 track cards with Track 1.5 as the emphasized center card', () => {
    const tracks = fixture.componentInstance.tracks;
    expect(tracks.map((t) => t.title)).toEqual([
      'Legitimate Security Operations',
      'Working together',
      'Non-Kinetic Engagement',
    ]);
    expect(tracks.map((t) => t.emphasized)).toEqual([false, true, false]);
  });

  it('renders the full-width banner image beneath the cards', () => {
    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();
  });
});
