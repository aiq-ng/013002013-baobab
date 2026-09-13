import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SuccessPage } from './success.page';

function setup(queryParams: Record<string, string>) {
  TestBed.configureTestingModule({
    imports: [SuccessPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { queryParamMap: of(convertToParamMap(queryParams)) },
      },
    ],
  });
  const fixture = TestBed.createComponent(SuccessPage);
  fixture.detectChanges();
  return fixture;
}

describe('SuccessPage', () => {
  it('creates', () => {
    const fixture = setup({});
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the reference ID from the query params', () => {
    const fixture = setup({ ref: 'BB-ABC123', source: 'contact-form' });
    expect(fixture.nativeElement.textContent).toContain('BB-ABC123');
  });

  it('shows source-specific confirmation copy for a known source', () => {
    const fixture = setup({ ref: 'BB-1', source: 'resources-classified-access' });
    expect(fixture.nativeElement.textContent).toContain('Access request received');
  });

  it('falls back to generic copy for an unknown/missing source', () => {
    const fixture = setup({ ref: 'BB-1' });
    expect(fixture.nativeElement.textContent).toContain('Submission received');
  });

  it('renders a real routed link back home as the primary CTA', () => {
    const fixture = setup({ ref: 'BB-1' });
    const homeLink = fixture.debugElement.query(By.css('a[href="/"]'));
    expect(homeLink).toBeTruthy();
  });

  it('renders a real routed secondary link to send another submission', () => {
    const fixture = setup({ ref: 'BB-1', source: 'contact-form' });
    const anchors = fixture.debugElement.queryAll(By.css('a'));
    expect(anchors.length).toBeGreaterThanOrEqual(2);
  });
});
