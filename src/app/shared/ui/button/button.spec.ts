import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Button } from './button';

describe('Button', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(Button);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a real anchor when given a routerLink', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Strategic Partnerships';
    fixture.componentInstance.routerLink = '/contact';
    fixture.detectChanges();

    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.textContent).toContain('Strategic Partnerships');
    expect(fixture.debugElement.query(By.css('button'))).toBeFalsy();
  });

  it('renders a real button and emits pressed when no routerLink is given', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Initiate Dialogue';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();

    let pressed = false;
    fixture.componentInstance.pressed.subscribe(() => (pressed = true));
    button.nativeElement.click();
    expect(pressed).toBe(true);
  });

  it('applies the primary variant class by default', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Go';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('button, a');
    expect(el.className).toContain('bg-brand-600');
  });

  it('applies the secondary/outline variant class when requested', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Download Doctrine Dossier';
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('button, a');
    expect(el.className).not.toContain('bg-brand-600');
  });

  it('disables the button element when disabled is true', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Go';
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });
});
