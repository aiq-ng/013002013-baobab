import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Eyebrow } from './eyebrow';

describe('Eyebrow', () => {
  let fixture: ComponentFixture<Eyebrow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eyebrow],
    }).compileComponents();
    fixture = TestBed.createComponent(Eyebrow);
  });

  it('renders the given text', () => {
    fixture.componentRef.setInput('text', 'KNOW ABOUT US');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('KNOW ABOUT US');
  });

  it('renders a leading rule mark alongside the text', () => {
    fixture.componentRef.setInput('text', 'THEMATIC ACTION');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
