import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Accordion } from './accordion';

describe('Accordion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Accordion] });
  });

  function setup() {
    const fixture = TestBed.createComponent(Accordion);
    fixture.componentInstance.items = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
    ];
    fixture.detectChanges();
    return fixture;
  }

  it('creates', () => {
    const fixture = TestBed.createComponent(Accordion);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a native button trigger per item with aria-expanded false initially', () => {
    const fixture = setup();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].attributes['aria-expanded']).toBe('false');
  });

  it('opens an item on click and sets aria-expanded true', () => {
    const fixture = setup();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();
    fixture.detectChanges();

    expect(buttons[0].attributes['aria-expanded']).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('A1');
  });

  it('closes any other open item when a new one opens (single-open behavior)', () => {
    const fixture = setup();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();
    fixture.detectChanges();
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(buttons[0].attributes['aria-expanded']).toBe('false');
    expect(buttons[1].attributes['aria-expanded']).toBe('true');
  });

  it('toggles closed when clicking the already-open trigger again', () => {
    const fixture = setup();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();
    fixture.detectChanges();
    buttons[0].nativeElement.click();
    fixture.detectChanges();

    expect(buttons[0].attributes['aria-expanded']).toBe('false');
  });
});
