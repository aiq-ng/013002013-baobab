import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DocumentaryVideo } from './documentary-video';

describe('DocumentaryVideo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DocumentaryVideo] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(DocumentaryVideo);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the caption and a labelled play control', () => {
    const fixture = TestBed.createComponent(DocumentaryVideo);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(
      'Documented Archival Reel: Tillabéri Cross-Border Pastoral Conciliation',
    );

    const playButton = fixture.debugElement.query(By.css('button'));
    expect(playButton).toBeTruthy();
    expect(playButton.attributes['aria-label']).toContain('Play');
  });

  it('toggles the playing state when the play control is activated', () => {
    const fixture = TestBed.createComponent(DocumentaryVideo);
    fixture.detectChanges();
    expect(fixture.componentInstance.isPlaying()).toBe(false);

    const playButton = fixture.debugElement.query(By.css('button'));
    playButton.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isPlaying()).toBe(true);
  });
});
