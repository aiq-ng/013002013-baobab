import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Card } from './card';

@Component({
  standalone: true,
  imports: [Card],
  template: `
    <app-card imageUrl="/theater.jpg" imageAlt="Sahel Central" badgeText="SAHEL CENTRAL">
      <h3 title>Liptako-Gourma Peace Corridor</h3>
      <p body>Establishment of bi-national customary transit protocols.</p>
      <a link href="/programs/liptako-gourma">View Thematic Report →</a>
    </app-card>
  `,
})
class HostComponent {}

describe('Card', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(Card);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('projects title, body and link content, and renders the image/badge inputs', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Liptako-Gourma Peace Corridor');
    expect(text).toContain('Establishment of bi-national customary transit protocols.');
    expect(text).toContain('View Thematic Report →');
    expect(text).toContain('SAHEL CENTRAL');

    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain('/theater.jpg');
    expect(img.alt).toBe('Sahel Central');
  });
});
