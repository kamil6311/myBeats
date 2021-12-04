import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  subj = new BehaviorSubject<string[]>([

  ]);

  observer$ = this.subj;

  constructor() { }

  ngOnInit() {
    this.addRow('newRow').subscribe();

    this.observer$.pipe(
      take(1)
    ).subscribe(val => console.log(val));


  }

  addRow(value: string){
    return this.subj.pipe(
      take(1),
      tap(list => {
        this.subj.next(list.concat(value));
      })
    );
  }


}
