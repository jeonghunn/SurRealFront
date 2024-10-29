import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityService } from '../identity.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public constructor(
    private identityService: IdentityService,
  ) {
  }
  public intercept(request: any, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes(environment.api_url)) {
      return next.handle(request);
    }

    const result: any = request.clone({
      setHeaders: {
        Authorization: this.identityService.auth,
      },
    });

    return next.handle(result);
  }
}
