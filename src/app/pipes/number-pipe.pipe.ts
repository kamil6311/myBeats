import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipePipe implements PipeTransform {

  transform(liste: Array<any>): any {
    return (liste.length.toString() +' musiques');
  }

}
