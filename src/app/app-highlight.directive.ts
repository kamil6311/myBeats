import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAppHighlight]'
})
export class HighlightDirective {

  constructor(private eleRef: ElementRef) {
    this.eleRef.nativeElement.style.background = 'lightGray';

  }

}
