import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Hero } from './hero';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';

describe('Hero', () => {
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();
    fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
  });

  it('renders the headline copy exactly as specified in the design export', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain(
      'Unlock Sovereign Resilience & Non-Kinetic Peacecraft To Transform West Africa.',
    );
  });

  it('renders all 4 stat counters from the hero export', () => {
    const stats = fixture.debugElement.queryAll(By.directive(StatCard));
    expect(stats.length).toBe(4);
  });

  it('renders the correct stat values, units, and labels', () => {
    const stats = fixture.debugElement.queryAll(By.directive(StatCard));
    const rendered = stats.map((s) => {
      const c = s.componentInstance as StatCard;
      return `${c.value}${c.unit}|${c.label}`;
    });
    expect(rendered).toEqual([
      '14,280KM|SECURED TRANSIT CORRIDORS',
      '184PACTS|CUSTOMARY ACCORDS',
      '-64%|CIVILIAN DE-ESCALATION',
      '9STATES|SOVEREIGN MANDATES',
    ]);
  });
});
