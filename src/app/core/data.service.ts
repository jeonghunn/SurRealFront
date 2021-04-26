import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  UserSimpleSet,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public httpErrorCode: Subject<number> = new Subject<number>();

  private readonly apiUrl: string = environment.api_url;

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  public signUp(formData: FormData): Observable<UserSimpleSet> {
    return this.httpClient.post<UserSimpleSet>(`${this.apiUrl}/user`, formData).pipe(
      map(this.handleResponse),
      catchError(error => this.handleError(error)),
    );
  }

  public signIn(formData: FormData): Observable<UserSimpleSet> {
    return this.httpClient.post<UserSimpleSet>(`${this.apiUrl}/user/signin`, formData);
  }

  public handleResponse(value: any): any {
    return value;
  }

  private handleError(error: HttpErrorResponse, isBig: boolean = true): Observable<any> {
    let isBigError: boolean = false;

    switch (error.status) {
      case 401:
        if (!window.location.href.includes('/signin')) {
          location.href = `/signin?return=${window.location.href}`;
        }
        break;
      case 403:
        this.matSnackBar.open(this.translateService.instant('HTTP_ERROR.403_FORBIDDEN.DESCRIPTION'));
        break;
      case 404:
        this.matSnackBar.open(this.translateService.instant('HTTP_ERROR.404_NOT_FOUND.DESCRIPTION'));
        isBigError = isBig;
        break;
      case 500:
      case 501:
      case 502:
      case 504:
        isBigError = isBig;
        break;
      default:
        break;
    }

    if (isBigError) {
      this.httpErrorCode.next(error.status);
    }

    return throwError(error);
  }

}
