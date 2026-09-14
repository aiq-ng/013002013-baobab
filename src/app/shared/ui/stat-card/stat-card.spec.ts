import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatCard] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(StatCard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the value and label', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentInstance.value = '14,280';
    fixture.componentInstance.label = 'Secured Transit Corridors';
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('14,280');
    expect(text).toContain('Secured Transit Corridors');
  });

  it('renders an optional unit alongside the value', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentInstance.value = '14,280';
    fixture.componentInstance.unit = 'KM';
    fixture.componentInstance.label = 'Secured Transit Corridors';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('KM');
  });

  it('applies an accent-on-dark style when requested', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentInstance.value = '184';
    fixture.componentInstance.label = 'Pacts';
    fixture.componentInstance.variant = 'on-dark';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.stat-card')?.className).toContain('text-white');
  });

  it('renders the value figure in brand green', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentInstance.value = '184';
    fixture.componentInstance.label = 'Pacts';
    fixture.componentInstance.variant = 'on-dark';
    fixture.detectChanges();

    const valueEl = fixture.nativeElement.querySelector('p');
    expect(valueEl?.className).toContain('text-brand-400');
  });
});
