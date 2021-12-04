/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MusicService } from '../musics/musics.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authForm: FormGroup;
  isLoading = false;
  isLogin = true;

  constructor(private mAuthService: AuthService,private mRouter: Router, private loadingCtrl: LoadingController,private alertCtrl: AlertController, private musicService: MusicService) { }

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
            loadingEl.message = 'Récupération des données...';
            this.musicService.fetchBeats().subscribe(
              () => {
                this.isLoading = false;
                loadingEl.dismiss();
                this.mRouter.navigateByUrl('/musics/tabs/library');
              }
            );
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = `Erreur lors de l'authentification, veuillez réessayez`;
            if (code === 'EMAIL_EXISTS') {
              message = 'Un compte avec cette adresse existe déjà.';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Addresse e-mail inconnue.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Mot de passe incorrect.';
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
        header: 'Authentication échouée',
        message: message,
        buttons: ['Ok']
      })
      .then(alertEl => alertEl.present());
  }

}
