import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatusPanel } from './status-panel';

@Component({
  standalone: true,
  imports: [StatusPanel],
  template: `<app-status-panel
    [variant]="variant"
    title="Could not load programs"
    message="Check your connection."
    actionLabel="Try again"
    (action)="retries = retries + 1"
  />`,
})
class Host {
  variant: 'empty' | 'error' = 'error';
  retries = 0;
}

describe('StatusPanel', () => {
  function setup(variant: 'empty' | 'error') {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant = variant;
    fixture.detectChanges();
    return fixture;
  }

  it('announces an error state as an alert with a retry action', () => {
    const fixture = setup('error');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Could not load programs');

    (el.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.retries).toBe(1);
  });

  it('renders an empty state without alerting', () => {
    const fixture = setup('empty');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')).toBeNull();
    expect(el.textContent).toContain('Check your connection.');
  });
});
