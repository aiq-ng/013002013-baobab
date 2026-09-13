import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CtaBand } from './cta-band';

describe('CtaBand', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CtaBand],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(CtaBand);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the heading and subtext', () => {
    const fixture = TestBed.createComponent(CtaBand);
    fixture.componentInstance.heading =
      'You can contribute to building resilient sovereign dialogue and regional security.';
    fixture.componentInstance.primaryLabel = 'Initiate Dialogue →';
    fixture.componentInstance.primaryRoute = '/contact';
    fixture.componentInstance.secondaryLabel = 'Download Doctrine Dossier';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('resilient sovereign dialogue');
  });

  it('renders exactly one primary button and one subordinate secondary button', () => {
    const fixture = TestBed.createComponent(CtaBand);
    fixture.componentInstance.heading = 'Heading';
    fixture.componentInstance.primaryLabel = 'Initiate Dialogue →';
    fixture.componentInstance.primaryRoute = '/contact';
    fixture.componentInstance.secondaryLabel = 'Download Doctrine Dossier';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('app-button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].componentInstance.variant).toBe('primary');
    expect(buttons[1].componentInstance.variant).toBe('secondary');
  });
});
