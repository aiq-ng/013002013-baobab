import { TestBed } from '@angular/core/testing';
import { DataProtections } from './data-protections';
import { ProtectionItem } from '../../models/resource';

const ITEMS: ProtectionItem[] = [
  { icon: 'shield', tint: 'brand', title: 'One', description: 'Desc one', badge: 'Badge One' },
  { icon: 'scales', tint: 'amber', title: 'Two', description: 'Desc two', badge: 'Badge Two' },
  {
    icon: 'eye-off',
    tint: 'slate',
    title: 'Three',
    description: 'Desc three',
    badge: 'Badge Three',
  },
];

describe('DataProtections', () => {
  it('renders the section heading and all 3 items with their badges', () => {
    TestBed.configureTestingModule({ imports: [DataProtections] });
    const fixture = TestBed.createComponent(DataProtections);
    fixture.componentInstance.items = ITEMS;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Privacy & Sovereign Data Protections');
    expect(text).toContain('One');
    expect(text).toContain('Badge One');
    expect(text).toContain('Two');
    expect(text).toContain('Three');
  });
});
