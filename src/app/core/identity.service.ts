import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  public constructor(
    private cookieService: CookieService,
  ) {

  }

  public get isSignedIn(): boolean {
    return this.auth?.length > 0;
  }

  public get auth(): string {
    return this.cookieService.get('Authorization');
  }

  public setAuth(auth: string): void {
    this.cookieService.set( 'auth', auth );
  }

}
