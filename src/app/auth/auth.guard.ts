import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private mAuthServcie: AuthService, private mRouter: Router){}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(!this.mAuthServcie.isUserAuth){
      this.mRouter.navigateByUrl('/auth');
    }
    return this.mAuthServcie.isUserAuth.pipe(
      take(1),
      tap(isAuth => {
        if(!isAuth){
          this.mRouter.navigateByUrl('/auth');
        }
      })
      );
  }
}
