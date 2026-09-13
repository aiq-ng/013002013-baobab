import { TestBed } from '@angular/core/testing';
import { LogoStrip } from './logo-strip';

describe('LogoStrip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LogoStrip] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(LogoStrip);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one image per logo with alt text', () => {
    const fixture = TestBed.createComponent(LogoStrip);
    fixture.componentInstance.logos = [
      { name: 'Peacebuilding', imageUrl: '/a.png' },
      { name: 'BBC', imageUrl: '/b.png' },
      { name: 'African Union', imageUrl: '/c.png' },
    ];
    fixture.detectChanges();

    const imgs: HTMLImageElement[] = Array.from(fixture.nativeElement.querySelectorAll('img'));
    expect(imgs.length).toBe(3);
    expect(imgs[0].alt).toBe('Peacebuilding');
  });

  it('renders no logos gracefully when the list is empty', () => {
    const fixture = TestBed.createComponent(LogoStrip);
    fixture.componentInstance.logos = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(0);
  });
});
