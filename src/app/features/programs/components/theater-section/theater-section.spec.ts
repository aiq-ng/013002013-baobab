import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgramsTheaterSection } from './theater-section';

describe('ProgramsTheaterSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgramsTheaterSection],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ProgramsTheaterSection);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the real-time data empty state instead of the card grid', () => {
    const fixture = TestBed.createComponent(ProgramsTheaterSection);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('All Theaters');
    expect(text).toContain('check back soon');
    expect(fixture.nativeElement.querySelectorAll('app-card').length).toBe(0);
  });
});
