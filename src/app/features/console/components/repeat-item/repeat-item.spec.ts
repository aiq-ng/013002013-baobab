import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RepeatItem } from './repeat-item';

@Component({
  standalone: true,
  imports: [RepeatItem],
  template: `<app-console-repeat-item
    headingId="kpi-0"
    title="KPI 1"
    summary="3 States Bound"
    [canRemove]="canRemove"
    (remove)="removed = removed + 1"
    ><p>body</p></app-console-repeat-item
  >`,
})
class Host {
  canRemove = true;
  removed = 0;
}

describe('RepeatItem', () => {
  function setup(canRemove = true) {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.canRemove = canRemove;
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('is a labelled group with a heading, summary and projected body', () => {
    const { el } = setup();
    const group = el.querySelector('[role="group"]')!;
    expect(group.getAttribute('aria-labelledby')).toBe('kpi-0');
    expect(el.querySelector('#kpi-0')?.textContent).toContain('KPI 1');
    expect(el.textContent).toContain('3 States Bound');
    expect(el.textContent).toContain('body');
  });

  it('names its remove button after the item', () => {
    const { fixture, el } = setup();
    const remove = el.querySelector('button') as HTMLButtonElement;
    expect(remove.getAttribute('aria-label')).toBe('Remove KPI 1');
    remove.click();
    expect(fixture.componentInstance.removed).toBe(1);
  });

  it('disables removal of the last required item and says why', () => {
    const { el } = setup(false);
    const remove = el.querySelector('button') as HTMLButtonElement;
    expect(remove.disabled).toBe(true);
    expect(remove.getAttribute('title')).toContain('At least one');
  });
});
