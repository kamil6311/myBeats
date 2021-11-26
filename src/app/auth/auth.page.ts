import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authForm: FormGroup;

  constructor(private mAuthService: AuthService,private mRouter: Router) { }

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.email,Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onLogin(){
      this.mAuthService.login(this.authForm.get('email').value, this.authForm.get('password').value).subscribe(
        (res: any) => {
          if(res.registered === true){
            console.log('logged succesfully');
            this.mRouter.navigateByUrl('/musics/tabs/library');
          }
        }
      );
  }

  onSignup(){
    if(this.authForm.valid){
      this.mAuthService.signup(this.authForm.get('email').value, this.authForm.get('password').value).subscribe(resData => {
        console.log(resData);
      });
    }
  }

}
