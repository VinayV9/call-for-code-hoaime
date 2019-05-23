import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;
  isLoggedIn: boolean =false;
  constructor(
    private authService: AuthService,
    private sharedServiceService: SharedServiceService
    ) { }

  ngOnInit() {
    this.sharedServiceService.cast.subscribe(user => this.user = user);
  }
  
  signInWithGoogle(): void{
    this.authService
    .signIn(GoogleLoginProvider.PROVIDER_ID)
    .then(
      (user) => {
        this.sendGoogleAuthToken(user.idToken);
      },
      (error) => { console.log("ERROR: error with sign in: "+error); }
    )
  }

  signOut(): void {
    this.authService.signOut();
    this.sharedServiceService.logOut();
  }

  

  sendGoogleAuthToken(token: string){
    this.sharedServiceService
    .sendGoogleAuthToken(token)
    .subscribe(
      (data: any) => {
        this.sharedServiceService.setProfile(data);
        localStorage.setItem('token', data.token);
      },
      (error) => { console.log("ERROR: error with sign in: "+ error)}
    );
  }
  
}
