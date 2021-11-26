import { Directive, ElementRef,Input } from '@angular/core';

@Directive({
  selector: '[appLiked]'
})
export class LikedDirective {
  @Input() appLiked = '';
  constructor(private eleRef: ElementRef) {
  }

}
