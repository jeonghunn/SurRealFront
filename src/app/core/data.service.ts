import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Gender,
  ResponseSet,
  UserSimpleSet,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly apiUrl: string = environment.api_url;

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) { }

  public getFromDataBase(action: string): FormData {
    const formData = new FormData();
    formData.append('a', action);
    formData.append('auth', 'asdf');
    formData.append('apiv', '1');
    formData.append('api_key', 'asdf');
    return formData;
  }

  public getCoreVersion(): Observable<string> {
    const formData = new FormData();
    formData.append('a', 'CoreVersion');

    return this.httpClient.post<string>(this.apiUrl, formData).pipe(
    );
  }

  public requestSignUp(gender: Gender): Observable<UserSimpleSet> {
    const formData: FormData = this.getFromDataBase('ting_signup');
    formData.append('gender', gender.toString());

    return this.httpClient.post<UserSimpleSet>(this.apiUrl, formData).pipe(
    );
  }

  public requestMatch(gender: Gender, message: string): Observable<ResponseSet> {
    const formData: FormData = this.getFromDataBase('ting_queue');
    formData.append('prefer_gender', gender.toString());
    formData.append('message', message);

    return this.httpClient.post<ResponseSet>(this.apiUrl, formData).pipe();
  }

  private handleDefaultResponse(value: any): any {
    return value;
  }

}
