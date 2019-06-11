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

  getPosts() {
    return this.http.get(`${this.baseUrl}/api/posts`, httpOptions)
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

  public uploadImage(image: File, description: string): any {
    const formData = new FormData();
    console.log(image);
    formData.append('image', image);
    formData.append('description', description)

    return this.http.post(`${this.baseUrl}/api/user/post`, formData);
  }

  getMarkers() {


    const geoJson = [{


      'type': 'Feature',


      'geometry': {


        'type': 'Point',


        'coordinates': ['80.20929129999999', '13.0569951']


      },


      'properties': {


        'message': 'Chennai'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': ['77.350048', '12.953847']
      },
      'properties': {
        'message': 'bangulare'
      }
    }];
    return geoJson;
  }

}
