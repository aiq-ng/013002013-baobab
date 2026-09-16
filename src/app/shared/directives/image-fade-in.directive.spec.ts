import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFadeInDirective } from './image-fade-in.directive';

@Component({
  standalone: true,
  imports: [ImageFadeInDirective],
  template: `<img src="/images/test.jpg" alt="test" appImgFadeIn />`,
})
class HostComponent {}

describe('ImageFadeInDirective', () => {
  function createFixture(): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('hides the image until it has loaded', () => {
    const fixture = createFixture();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.classList.contains('img-fade-in')).toBe(true);
    expect(img.classList.contains('img-fade-in--loaded')).toBe(false);
  });

  it('reveals the image once the load event fires', () => {
    const fixture = createFixture();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    img.dispatchEvent(new Event('load'));

    expect(img.classList.contains('img-fade-in--loaded')).toBe(true);
  });

  it('reveals the image if it errors, so a broken image is never hidden forever', () => {
    const fixture = createFixture();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    img.dispatchEvent(new Event('error'));

    expect(img.classList.contains('img-fade-in--loaded')).toBe(true);
  });

  it('reveals immediately if the image was already complete when the directive initialized (cache hit)', () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    });

    const fixture = createFixture();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.classList.contains('img-fade-in--loaded')).toBe(true);

    Reflect.deleteProperty(HTMLImageElement.prototype, 'complete');
  });
});
