import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerCategories } from './partner-categories';

describe('PartnerCategories', () => {
  let fixture: ComponentFixture<PartnerCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerCategories],
    }).compileComponents();
    fixture = TestBed.createComponent(PartnerCategories);
    fixture.detectChanges();
  });

  it('renders the "Our Partners" label', () => {
    expect(fixture.nativeElement.textContent).toContain('Our Partners');
  });

  it('renders the 5 partner categories from the design export, in order', () => {
    const items: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('li'));
    expect(items.map((li) => li.textContent!.trim())).toEqual([
      'Governments and Local Authorities',
      'Traditional and Religious Institutions',
      'ECOWAS, AES and AU',
      'Agencies and International Partners',
      'Civil Society and Community Organizations',
    ]);
  });

  it('marks every category icon as decorative', () => {
    const icons: SVGElement[] = Array.from(fixture.nativeElement.querySelectorAll('svg'));
    expect(icons.length).toBe(5);
    icons.forEach((icon) => expect(icon.getAttribute('aria-hidden')).toBe('true'));
  });
});
