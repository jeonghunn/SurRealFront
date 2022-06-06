import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  take,
  tap,
} from 'rxjs/operators';
import {
  User,
  UserSimpleSet,
} from 'src/app/model/type';
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

  public get isNeedToVerify(): boolean {
    return this.isSignedIn && this.user$.getValue() === undefined;
  }

  public get auth(): string {
    return this.cookieService.get('Authorization');
  }

  public get firstName(): string {
    return this.user$.getValue()?.name;
  }

  public get id(): number {
    return this.user$.getValue()?.id;
  }

  public verify(): Observable<User> {
    return this.dataService.verify().pipe(
      tap((result: any) => this.user$.next(result.user)),
    );
  }

  public signIn(form: UntypedFormGroup): Observable<UserSimpleSet> {
    return this.dataService.signIn(form.value).pipe(
        take(1),
      );
  }

  public remove(): void {
    this.cookieService.delete('Authorization', '/');
  }

}
