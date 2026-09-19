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
    (rowActivated)="onActivated($event)"
  />`,
})
class HostComponent {
  columns = COLUMNS;
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
    expect(fixture.debugElement.queryAll(By.css('tbody tr[role="button"]')).length).toBe(2);
  });

  it('emits rowActivated on click', () => {
    const fixture = setup();
    fixture.debugElement.query(By.css('tbody tr')).nativeElement.click();
    expect(fixture.componentInstance.activated).toEqual([{ id: '1', name: 'Alpha' }]);
  });

  it('emits rowActivated on Enter and Space, for keyboard activation', () => {
    const fixture = setup();
    const row = fixture.debugElement.queryAll(By.css('tbody tr'))[1];

    const noop = (): void => undefined;
    row.triggerEventHandler('keydown', { key: 'Enter', preventDefault: noop });
    row.triggerEventHandler('keydown', { key: ' ', preventDefault: noop });

    expect(fixture.componentInstance.activated).toEqual([
      { id: '2', name: 'Beta' },
      { id: '2', name: 'Beta' },
    ]);
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
    expect(fixture.debugElement.query(By.css('.overflow-x-auto'))).toBeTruthy();
  });
});
