import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { SharedServiceService } from '../services/shared-service/shared-service.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements HttpInterceptor {
  constructor(
    private sharedServiceService: SharedServiceService
  ){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //  console.log("hello"+ this.sharedServiceService.getToken());
   request = request.clone({
      setHeaders: {
        Authorization: this.sharedServiceService.getToken() || ''
      }
    });
    return next.handle(request);
  }  
}
