import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataTable, DataTableColumn } from './data-table';

interface Row {
  id: string;
  name: string;
}

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'id', header: 'ID', cell: (r) => r.id },
  { key: 'name', header: 'Name', cell: (r) => r.name },
];

@Component({
  standalone: true,
  imports: [DataTable],
  template: `<app-data-table
    [columns]="columns"
    [rows]="rows"
    [loading]="loading"
    caption="Rows"
    [rowLabel]="rowLabel"
    (rowActivated)="onActivated($event)"
  />`,
})
class HostComponent {
  columns: DataTableColumn<Row>[] = COLUMNS;
  loading = false;
  rowLabel = (r: Row): string => `Open ${r.id}`;
  rows: Row[] = [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
  ];
  activated: Row[] = [];
  onActivated(row: Row): void {
    this.activated.push(row);
  }
}

describe('DataTable', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a header cell per column and a row per item', () => {
    const fixture = setup();
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.map((h) => h.nativeElement.textContent.trim())).toEqual(['ID', 'Name']);
    expect(fixture.debugElement.queryAll(By.css('tbody tr')).length).toBe(2);
  });

  it('keeps real table semantics — rows are never re-roled as buttons', () => {
    const fixture = setup();
    expect(fixture.debugElement.queryAll(By.css('tr[role]')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('tr[tabindex]')).length).toBe(0);
  });

  it('gives each row a real, labelled button in its first cell for keyboard users', () => {
    const fixture = setup();
    const buttons = fixture.debugElement.queryAll(By.css('tbody td:first-child button'));
    expect(buttons.length).toBe(2);
    expect(buttons[1].nativeElement.getAttribute('aria-label')).toBe('Open 2');

    buttons[1].nativeElement.click();
    expect(fixture.componentInstance.activated).toEqual([{ id: '2', name: 'Beta' }]);
  });

  it('emits rowActivated on click', () => {
    const fixture = setup();
    fixture.debugElement.query(By.css('tbody tr')).nativeElement.click();
    expect(fixture.componentInstance.activated).toEqual([{ id: '1', name: 'Alpha' }]);
  });

  it('emits once when the row button itself is clicked (no double-fire via the row)', () => {
    const fixture = setup();
    fixture.debugElement.query(By.css('tbody button')).nativeElement.click();
    expect(fixture.componentInstance.activated.length).toBe(1);
  });

  it('makes the scroll container a focusable, named region so keyboard users can scroll it', () => {
    const fixture = setup();
    const region = fixture.debugElement.query(By.css('[role="region"]')).nativeElement;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.getAttribute('aria-label')).toBe('Rows');
  });

  it('renders a busy skeleton instead of rows while loading', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table').getAttribute('aria-busy')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Loading');
    expect(fixture.nativeElement.textContent).not.toContain('Alpha');
  });

  it('renders a toned badge for columns that declare one', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.columns = [
      ...COLUMNS,
      { key: 'state', header: 'State', cell: () => 'new', tone: () => 'info' },
    ];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-tone="info"]')?.textContent).toContain('new');
  });

  it('shows the empty message when there are no rows', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.rows = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No results.');
  });

  it('wraps the table in a horizontally-scrollable container', () => {
    const fixture = setup();
    expect(fixture.debugElement.query(By.css('.console-scroll-region table'))).toBeTruthy();
  });
});
