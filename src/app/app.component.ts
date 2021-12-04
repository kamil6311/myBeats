import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  like = '';
  private mSub: Subscription;
  constructor(private mAuthService: AuthService, private mRouter: Router) {}



  ngOnInit(): void {
    this.mSub = this.mAuthService.isUserAuth.subscribe(isAuth => {
      if(!isAuth){
        this.mRouter.navigateByUrl('/auth');
      }
    });
  }
  ngOnDestroy(): void {
    if(this.mSub){
      this.mSub.unsubscribe();
    }
  }

  onLogout(){
    this.mAuthService.logout();
  }
}
