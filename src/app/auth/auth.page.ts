/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authForm: FormGroup;
  isLoading = false;
  isLogin = true;

  constructor(private mAuthService: AuthService,private mRouter: Router, private loadingCtrl: LoadingController,private alertCtrl: AlertController) { }

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

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Connexion...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<any>;
        if (this.isLogin) {
          authObs = this.mAuthService.login(email, password);
        } else {
          authObs = this.mAuthService.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.mRouter.navigateByUrl('/musics/tabs/library');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  }


  onLogin(){
      // this.mAuthService.login(this.authForm.get('email').value, this.authForm.get('password').value).subscribe(
      //   (res: any) => {
      //     if(res.registered === true){
      //       console.log('logged succesfully');
      //       this.mRouter.navigateByUrl('/musics/tabs/library');
      //     }
      //   }
      // );
      this.isLogin = true;
      this.authenticate(this.authForm.get('email').value, this.authForm.get('password').value);
  }

  onSignup(){
    // if(this.authForm.valid){
    //   this.mAuthService.signup(this.authForm.get('email').value, this.authForm.get('password').value).subscribe(resData => {
    //     console.log(resData);
    //   });
    // }
    this.isLogin = false;
    this.authenticate(this.authForm.get('email').value, this.authForm.get('password').value);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
