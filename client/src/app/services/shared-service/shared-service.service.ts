import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  baseUrl: string = "http://localhost:8080";
  private user = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
  cast = this.user.asObservable();

  constructor(private http: HttpClient, ) {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  sendGoogleAuthToken(token: string) {
    return this.http.post(`${this.baseUrl}/api/auth/google`, { token }, httpOptions)
  }

  getProfile(id) {
    console.log(id);
    return this.http.get(`${this.baseUrl}/api/user/profile/${id}`, httpOptions)
  }

  getDisasters() {
    return this.http.get(`${this.baseUrl}/api/disasters`, httpOptions)
  }

  setProfile(data) {
    let newUser = {
      username: data.username,
      avtar: data.avtar,
      email: data.email,
      id: data.id
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    this.user.next(newUser);
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.next(null);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  public uploadImage(image: File, log: string, lat: string): any {
    const formData = new FormData();
    console.log(image);
    formData.append('image', image);
    formData.append('log', log);
    formData.append('lat', lat);
    return this.http.post(`${this.baseUrl}/api/user/disaster`, formData);
  }

  //pollution api
  getPollutionDetails(lat: number, log: number){
    let apikey: string = "n6tc2tfof3636aa7q7ob95nfqb";
    return this.http.get(`http://api.airpollutionapi.com/1.0/aqi?lat=${lat}&lon=${log}&APPID=${apikey}`);
  }

  getImageVisualizationDetails(lat: number, log: number){
    return this.http.post(`${this.baseUrl}/api/analysis/disaster`, {lat, log} );
  }

}
