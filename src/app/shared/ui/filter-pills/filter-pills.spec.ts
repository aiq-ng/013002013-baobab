import { TestBed } from '@angular/core/testing';
import { FilterPills } from './filter-pills';

describe('FilterPills', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [FilterPills] });
    const fixture = TestBed.createComponent(FilterPills);
    const component = fixture.componentInstance;
    component.pills = ['All Accords', 'Transhumance', 'Riparian & Water'];
    component.active = 'All Accords';
    component.ariaLabel = 'Filter treaties archive';
    fixture.detectChanges();
    return fixture;
  }

  function pills(fixture: ReturnType<typeof render>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('renders one button per pill inside a labelled group', () => {
    const fixture = render();
    expect(pills(fixture).map((b) => b.textContent?.trim())).toEqual([
      'All Accords',
      'Transhumance',
      'Riparian & Water',
    ]);

    const group: HTMLElement = fixture.nativeElement.querySelector('[role="group"]');
    expect(group.getAttribute('aria-label')).toBe('Filter treaties archive');
  });

  it('marks only the active pill with aria-pressed="true"', () => {
    const fixture = render();
    expect(pills(fixture).map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ]);
  });

  it('emits activeChange with the pill that was clicked', () => {
    const fixture = render();
    const selected: string[] = [];
    fixture.componentInstance.activeChange.subscribe((pill: string) => selected.push(pill));

    pills(fixture)[1].click();

    expect(selected).toEqual(['Transhumance']);
  });

  it('does not render the group at all when there is nothing to filter by', () => {
    const fixture = render();
    fixture.componentRef.setInput('pills', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="group"]')).toBeNull();
  });
});
