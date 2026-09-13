import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TheaterSection } from './theater-section';

describe('TheaterSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TheaterSection],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(TheaterSection);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders filter pills driven by the theater data, matching the design tab labels', () => {
    const fixture = TestBed.createComponent(TheaterSection);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('All Theaters');
    expect(text).toContain('Sahel Central');
    expect(text).toContain('Lake Chad Basin');
    expect(text).toContain('Gulf of Guinea');
    expect(text).toContain('Continental ECOWAS');
  });

  it('shows the real-time data empty state instead of the card grid', () => {
    const fixture = TestBed.createComponent(TheaterSection);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('check back soon');
    expect(fixture.nativeElement.querySelectorAll('app-card').length).toBe(0);
  });
});
