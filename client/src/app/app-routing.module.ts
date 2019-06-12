import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { DisasterComponent } from './components/disaster/disaster.component';
import { MapAnalysisComponent } from './components/map-analysis/map-analysis.component';

const routes: Routes = [
  { path: '', component:  DisasterComponent},
  { path: 'profile', component:  ProfileComponent},
  { path: 'disaster', component:  DisasterComponent},
  { path: 'map', component:  MapAnalysisComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
