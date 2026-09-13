import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TheaterPreviews } from './theater-previews';
import { Card } from '../../../../shared/ui/card/card';

describe('TheaterPreviews', () => {
  let fixture: ComponentFixture<TheaterPreviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheaterPreviews],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(TheaterPreviews);
    fixture.detectChanges();
  });

  it('renders the section heading and intro copy', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('THEMATIC ACTION');
    expect(el.textContent).toContain('Our Operational Theaters');
  });

  it('renders exactly 3 theater preview cards, each with a real link', () => {
    const cards = fixture.debugElement.queryAll(By.directive(Card));
    expect(cards.length).toBe(3);
    const links: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a[href]');
    expect(links.length).toBe(3);
    links.forEach((link) => expect(link.getAttribute('href')).toBeTruthy());
  });

  it('renders the theater titles from the design export', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Liptako-Gourma Peace Corridor');
    expect(el.textContent).toContain('Customary Demobilization');
    expect(el.textContent).toContain('Gulf of Guinea Northern Flank');
  });
});
