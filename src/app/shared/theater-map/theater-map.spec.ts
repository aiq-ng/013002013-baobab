import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TheaterMap } from './theater-map';

describe('TheaterMap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TheaterMap],
      providers: [provideRouter([])],
    });
  });

  function setup() {
    const fixture = TestBed.createComponent(TheaterMap);
    fixture.componentInstance.theaters = [
      {
        name: 'Liptako-Gourma Peace Corridor',
        theater: 'Sahel Central',
        description: 'Establishment of bi-national customary transit protocols.',
        imageUrl: '/a.jpg',
        route: '/programs/liptako-gourma',
      },
      {
        name: 'Customary Demobilization',
        theater: 'Lake Chad Basin',
        description: 'Empowering sustainable and village truth-telling ceremonies.',
        imageUrl: '/b.jpg',
        route: '/programs/customary-demobilization',
      },
      {
        name: 'Gulf of Guinea Northern Flank',
        theater: 'Littoral Buffer',
        description: 'Pre-emptive dialogue advanced along northern frontier trade routes.',
        imageUrl: '/c.jpg',
        route: '/programs/gulf-of-guinea',
      },
    ];
    fixture.detectChanges();
    return fixture;
  }

  it('creates', () => {
    const fixture = TestBed.createComponent(TheaterMap);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a card for every theater and a filter pill for every distinct theater name', () => {
    const fixture = setup();
    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toBe(3);

    const pills = fixture.debugElement.queryAll(By.css('[role="group"] button'));
    // "All" pill + 3 distinct theaters
    expect(pills.length).toBe(4);
  });

  it('marks the active pill with aria-pressed and role=group on the pill container', () => {
    const fixture = setup();
    const group = fixture.debugElement.query(By.css('[role="group"]'));
    expect(group).toBeTruthy();

    const allPill = fixture.debugElement.queryAll(By.css('[role="group"] button'))[0];
    expect(allPill.attributes['aria-pressed']).toBe('true');
  });

  it('filters the grid to only the selected theater when a pill is clicked', () => {
    const fixture = setup();
    const pills = fixture.debugElement.queryAll(By.css('[role="group"] button'));
    const sahelPill = pills.find((p) => p.nativeElement.textContent.includes('Sahel Central'));
    sahelPill!.nativeElement.click();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-card'));
    expect(cards.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Liptako-Gourma Peace Corridor');
    expect(sahelPill!.attributes['aria-pressed']).toBe('true');
  });

  it('shows all theaters again when the All pill is re-selected', () => {
    const fixture = setup();
    let pills = fixture.debugElement.queryAll(By.css('[role="group"] button'));
    pills[1].nativeElement.click();
    fixture.detectChanges();
    pills = fixture.debugElement.queryAll(By.css('[role="group"] button'));
    pills[0].nativeElement.click();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toBe(3);
  });

  it('renders an empty state instead of the card grid when dataUnavailable is set, while still showing filter pills', () => {
    const fixture = TestBed.createComponent(TheaterMap);
    fixture.componentInstance.dataUnavailable = true;
    fixture.componentInstance.theaters = [
      {
        name: 'Liptako-Gourma Peace Corridor',
        theater: 'Sahel Central',
        description: 'Establishment of bi-national customary transit protocols.',
        imageUrl: '/a.jpg',
        route: '/programs/liptako-gourma',
      },
    ];
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-card')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('[role="group"] button')).length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('check back soon');
  });
});
