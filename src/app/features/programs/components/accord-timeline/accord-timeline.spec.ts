import { TestBed } from '@angular/core/testing';
import { AccordTimeline } from './accord-timeline';

describe('AccordTimeline', () => {
  it('renders the heading and every milestone', () => {
    TestBed.configureTestingModule({ imports: [AccordTimeline] });
    const fixture = TestBed.createComponent(AccordTimeline);
    fixture.componentRef.setInput('eyebrow', 'ACCORD TIMELINE');
    fixture.componentRef.setInput('heading', 'Verified Accord Milestones & Field Chronicle');
    fixture.componentRef.setInput('description', 'Chronological documentation.');
    fixture.componentRef.setInput('milestones', [
      {
        date: 'November 2024',
        kicker: 'Diplomatic Decree',
        title: 'Hombori Basin Water Allocation Framework Ratified',
        description: 'desc',
        tags: ['Field Protocol Enforced'],
      },
      {
        date: 'February 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Assembly',
        description: 'desc',
        tags: [],
      },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Verified Accord Milestones & Field Chronicle');
    expect(text).toContain('Hombori Basin Water Allocation Framework Ratified');
    expect(text).toContain('Field Protocol Enforced');
    expect(text).toContain('Foundational Assembly');
  });
});
