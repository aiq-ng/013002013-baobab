import { TestBed } from '@angular/core/testing';
import { PartnershipsPartnerGroups } from './partner-groups';

describe('PartnershipsPartnerGroups', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PartnershipsPartnerGroups] });
  });

  it('renders the "Our Partners" heading and all five partner groups', () => {
    const fixture = TestBed.createComponent(PartnershipsPartnerGroups);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')!.textContent).toContain('Our Partners');
    expect(el.querySelectorAll('li').length).toBe(5);
    expect(el.textContent).toContain('Civil Society and Community Organizations');
  });
});
