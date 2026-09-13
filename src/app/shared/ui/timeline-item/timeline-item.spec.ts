import { TestBed } from '@angular/core/testing';
import { TimelineItem } from './timeline-item';

describe('TimelineItem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TimelineItem] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(TimelineItem);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders date, title and description', () => {
    const fixture = TestBed.createComponent(TimelineItem);
    fixture.componentInstance.date = '2024-06';
    fixture.componentInstance.title = 'Accord Ratified';
    fixture.componentInstance.description = 'Customary chiefs and state signatories ratify.';
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('2024-06');
    expect(text).toContain('Accord Ratified');
    expect(text).toContain('Customary chiefs and state signatories ratify.');
  });

  it('hides the connecting line on the last item', () => {
    const fixture = TestBed.createComponent(TimelineItem);
    fixture.componentInstance.date = '2024-06';
    fixture.componentInstance.title = 'Accord Ratified';
    fixture.componentInstance.description = 'desc';
    fixture.componentInstance.isLast = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-connector]')).toBeFalsy();
  });
});
