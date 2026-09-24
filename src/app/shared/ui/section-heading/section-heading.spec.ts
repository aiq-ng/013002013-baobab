import { TestBed } from '@angular/core/testing';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  function render(setup: (instance: SectionHeading) => void) {
    TestBed.configureTestingModule({ imports: [SectionHeading] });
    const fixture = TestBed.createComponent(SectionHeading);
    setup(fixture.componentInstance);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the eyebrow, heading, and lead copy', () => {
    const fixture = render((c) => {
      c.eyebrow = 'Sovereignty Governance';
      c.heading = 'Privacy & Sovereign Data Protections';
      c.lead = 'Architectural measures.';
    });

    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('Sovereignty Governance');
    expect(host.querySelector('h2')?.textContent?.trim()).toBe(
      'Privacy & Sovereign Data Protections',
    );
    expect(host.textContent).toContain('Architectural measures.');
  });

  it('omits the lead paragraph when none is supplied', () => {
    const fixture = render((c) => {
      c.eyebrow = 'Eyebrow';
      c.heading = 'Heading';
    });

    expect(fixture.nativeElement.querySelectorAll('p').length).toBe(1);
  });

  it('centers the block and its lead copy when align is "center"', () => {
    const fixture = render((c) => {
      c.eyebrow = 'Eyebrow';
      c.heading = 'Heading';
      c.lead = 'Lead';
      c.align = 'center';
    });

    const wrapper: HTMLElement = fixture.nativeElement.firstElementChild;
    expect(wrapper.className).toContain('text-center');
    expect(wrapper.className).toContain('items-center');
  });

  it('is left-aligned by default', () => {
    const fixture = render((c) => {
      c.eyebrow = 'Eyebrow';
      c.heading = 'Heading';
    });

    expect(fixture.nativeElement.firstElementChild.className).not.toContain('text-center');
  });
});
