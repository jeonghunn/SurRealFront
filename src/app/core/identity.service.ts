import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(undefined);

  public constructor(
    private cookieService: CookieService,
    private dataService: DataService,
  ) {

  }

  public get isSignedIn(): boolean {
    return this.auth?.length > 0;
  }

  public get auth(): string {
    return this.cookieService.get('Authorization');
  }

  public get firstName(): string {
    return this.user$.getValue()?.name;
  }

  public verify(): Observable<User> {
    return this.dataService.verify().pipe(
      tap((user: User) => this.user$.next(user)),
    );
  }

  public remove(): void {
    this.cookieService.delete('Authorization');
  }

}
