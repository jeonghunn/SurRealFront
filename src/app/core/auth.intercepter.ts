import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityService } from './identity.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public constructor(
    private identityService: IdentityService,
  ) {
  }
  public intercept(request: any, next: HttpHandler): Observable<HttpEvent<any>> {
    const result: any = request.clone({
      setHeaders: {
        Authorization: this.identityService.auth,
      },
    });

    return next.handle(result);
  }
}
