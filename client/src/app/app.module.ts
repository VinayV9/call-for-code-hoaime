import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialdesignModule } from './modules/materialdesign/materialdesign.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthGuard } from './gaurds/auth.gaurd';
import { SharedServiceService } from './services/shared-service/shared-service.service';
import { DisasterComponent } from './components/disaster/disaster.component';
import {WebcamModule} from 'ngx-webcam';
import { MapAnalysisComponent } from './components/map-analysis/map-analysis.component';
// import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('647071390578-7v707p9ekrejnoohrtl5ghh7bp00ipq2.apps.googleusercontent.com')
  }
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider('561602290896109')
  // },
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider('78iqy5cu2e1fgr')
  // }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DisasterComponent,
    MapAnalysisComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialdesignModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    WebcamModule,
    // NgxMapboxGLModule.withConfig({
    //   accessToken: 'pk.eyJ1IjoidmluYXl2OSIsImEiOiJjaml6ajh4YnQwNjhzM3dwMWRmdmk2eW51In0.gVEIvhU0lN2i8l-Hc2g32g', // Optionnal, can also be set per map (accessToken input of mgl-map)
    //   geocoderAccessToken: 'pk.eyJ1IjoidmluYXl2OSIsImEiOiJjaml6ajh4YnQwNjhzM3dwMWRmdmk2eW51In0.gVEIvhU0lN2i8l-Hc2g32g' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    // })
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {provide : HTTP_INTERCEPTORS, useClass : AuthGuard, multi:true},
    SharedServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
