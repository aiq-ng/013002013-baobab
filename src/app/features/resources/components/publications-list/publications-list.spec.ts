import { TestBed } from '@angular/core/testing';
import { PublicationsList } from './publications-list';
import { createRegistryDocument } from '../../testing/resource-fixture';

describe('PublicationsList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PublicationsList] });
  });

  it('renders the section heading, subtext, and the "All documents" filter label', () => {
    const fixture = TestBed.createComponent(PublicationsList);
    fixture.componentRef.setInput('documents', []);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Baobab Depository');
    expect(text).toContain('All publications');
    expect(text).toContain(
      'Bilateral instruments, inter-community grazing compacts, and riparian water pacts enacted under dual civil-customary authority.',
    );
    expect(text).toContain('All documents');
  });

  it('renders one publication card per document', () => {
    const fixture = TestBed.createComponent(PublicationsList);
    fixture.componentRef.setInput('documents', [
      createRegistryDocument({ id: 'a', title: 'Sovereign Dialogue Facilitation' }),
      createRegistryDocument({ id: 'b', title: 'Hybrid Mediation & Reconciliation' }),
    ]);
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('app-publication-card h3'),
    ).map((h) => (h as HTMLElement).textContent!.trim());
    expect(titles).toEqual([
      'Sovereign Dialogue Facilitation',
      'Hybrid Mediation & Reconciliation',
    ]);
  });

  it('shows an empty state instead of a blank list when there are no documents', () => {
    const fixture = TestBed.createComponent(PublicationsList);
    fixture.componentRef.setInput('documents', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-status-panel')).toBeTruthy();
  });
});
