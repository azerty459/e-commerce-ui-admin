import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {AuthDataService} from '../business/auth-data.service';
import {throwError} from 'rxjs/internal/observable/throwError';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthDataService) {
  }

  /**
   * Personalise le header de toutes les requétes
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.isSet()) {
      return next.handle(req);
    }
    // Clone the request and set the new header in one step.
    const authReq = req.clone({setHeaders: {Authorization: this.auth.getToken()}});
    return next.handle(authReq)
      .catch((error, caught) => {
        if (error.status >= 500) {
          console.log('une erreur est survenue');
          console.log(error);
          this.auth.logout();
        }
        return throwError(error);
      }) as any;
  }
}
