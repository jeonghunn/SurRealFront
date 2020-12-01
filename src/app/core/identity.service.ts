import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  private auth: string = null;

  public constructor(
    private cookieService: CookieService,
  ) {

  }

  public setAuth(auth: string): void {
    this.auth = auth;
    this.cookieService.set( 'auth', auth );
  }

  public getUserId(): number {
    return Number.parseInt(this.cookieService.get('auth'));
  }

  public getAuth(): string {
    return this.cookieService.get('auth');
  }

}
