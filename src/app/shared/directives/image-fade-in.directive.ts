import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';

/**
 * Keeps an <img> hidden until it has fully decoded, then fades it in.
 * Prevents the "renders top-to-bottom while streaming" flash on slow connections.
 */
@Directive({
  selector: 'img[appImgFadeIn]',
  standalone: true,
  host: {
    class: 'img-fade-in',
  },
})
export class ImageFadeInDirective implements OnInit {
  private readonly elementRef = inject(ElementRef<HTMLImageElement>);

  ngOnInit(): void {
    if (this.elementRef.nativeElement.complete) {
      this.reveal();
    }
  }

  @HostListener('load')
  @HostListener('error')
  reveal(): void {
    this.elementRef.nativeElement.classList.add('img-fade-in--loaded');
  }
}
