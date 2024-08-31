import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';
import {
  Chat,
  Communication,
  Group,
  LiveMessage,
  Relation,
  Room,
  Topic,
  User,
  UserSimpleSet,
} from 'src/app/model/type';
import { environment } from 'src/environments/environment';
import { Util } from './util';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public httpErrorCode: Subject<number> = new Subject<number>();

  public transferProgresses$: BehaviorSubject<{ [key: string]: number }> = new BehaviorSubject<{ [key: string]: number }>({});
  private readonly apiUrl: string = environment.api_url;

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  public deserializeSocketMessage(message: any): any {

    switch (typeof message.data) {
      case 'string':
        return JSON.parse(message?.data);
      case 'object':
        return new LiveMessage(message?.data);
    }
  }

  public serializeSocketMessage(message: any | Communication): any {

    if (message instanceof Communication) {
      return JSON.stringify(message);
    }

    return message;
  }

  public setTransferProgress(key: string, value: number): void {
    const progresses: { [key: string]: number } = this.transferProgresses$.getValue();
    progresses[key] = value;
    this.transferProgresses$.next(progresses);
  }

  public removeTransferProgress(key: string): void {
    const progresses: { [key: string]: number } = this.transferProgresses$.getValue();
    delete progresses[key];
    this.transferProgresses$.next(progresses);
  }

  public signUp(formData: FormData): Observable<UserSimpleSet> {
    return this.httpClient.post<UserSimpleSet>(`${this.apiUrl}/user`, formData).pipe(
      map(this.handleResponse),
      catchError(error => this.handleError(error)),
    );
  }

  public postClient(key: string, token: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/client`, {
      key,
      token,
    }).pipe(
      map(this.handleResponse),
    );
  }

  public getTopic(
    groupId: number,
    roomId: number,
    topicId: number,
    ): Observable<Topic> {
    return this.httpClient.get<Topic>(`${this.apiUrl}/group/${groupId}/room/${roomId}/topic/${topicId}`, {}).pipe(
      catchError(error => this.handleError(error)),
    );
  }


  public getBlob(url: string, fileName: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    this.setTransferProgress(url, 0.1);

    return this.httpClient.get(url, {
        headers,
        responseType: 'blob',
        reportProgress: true,
    }).pipe(
        catchError(error => this.handleError(error, false)),
    );
    
  }

  public getFriendList(): Observable<Relation[]> {
    return this.httpClient.get<{ relations: Relation[] }>(`${this.apiUrl}/user/friends`, {}).pipe(
      map((result: { relations: Relation[] }) => result.relations),
      catchError(error => this.handleError(error)),
    );
  }

  public getGroupList(): Observable<Group[]> {
    return this.httpClient.get<{ groups: Group[] }>(`${this.apiUrl}/group/`, {}).pipe(
      map((result: { groups: Group[] }) => result.groups),
      catchError(error => this.handleError(error)),
    );
  }

  public getGroup(id: number, bigError: boolean = true): Observable<Group> {
    return this.httpClient.get<{ group: Group }>(`${this.apiUrl}/group/${id}`, {}).pipe(
      map((result: { group: Group }) => result.group),
      catchError(error => this.handleError(error, bigError)),
    );
  }

  public getRoom(groupId: number, id: number): Observable<Room> {
    return this.httpClient.get<{ room: Room }>(`${this.apiUrl}/group/${groupId}/room/${id}`, {}).pipe(
      map((result: { room: Room }) => result.room),
      catchError(error => this.handleError(error)),
    );
  }

  public getRooms(groupId: number, offset: number = 0, limit: number = 15): Observable<Room[]> {
    return this.httpClient.get<{ rooms: Room[] }>(`${this.apiUrl}/group/${groupId}/room?offset=${offset}&limit=${limit}`, {}).pipe(
      map((result: { rooms: Room[] }) => result.rooms),
      catchError(error => this.handleError(error)),
    );
  }

  public createRoom(groupId: number, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/group/${groupId}/room`, data).pipe(
      map((result: { group: Group }) => result.group),
      catchError(error => this.handleError(error, false)),
    );
  }

  public createTopicByChat(groupId: number, roomId: number, chatId: string, name: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}/group/${groupId}/room/${roomId}/topic/chat/${chatId}`,
      { name: Util.truncate(name, 20) },
      ).pipe(
      catchError(error => this.handleError(error, false)),
    );
  }

  public updateSpace(
    key: string,
    groupId: number,
    roomId: number,
    title: string,
    content: any,
    basedVersion: number,
    ): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}/group/${groupId}/room/${roomId}/space/${key}`,
        {
          based_version: basedVersion,
          title,
          content,
        },
        );
  }

  public createTopic(
    groupId: number,
    roomId: number,
    topicId: number,
    name: string,
    spaceAppName: string,
    ): Observable<{
      space: any,
      topic: Topic,
    }> {
    return this.httpClient.post<{
      space: any,
      topic: Topic,
    }>(
      `${this.apiUrl}/group/${groupId}/room/${roomId}/topic`,
      {
        topic_id: topicId,
        name: name,
        space: spaceAppName,
      },
      ).pipe(
      catchError(error => this.handleError(error, false)),
    );
  }

  public getSpace(groupId: number, roomId: number, key: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/group/${groupId}/room/${roomId}/space/${key}`).pipe(
      catchError(error => this.handleError(error, false)),
    );
  }

  public postAttach(
    roomId: number,
    file: File,
): Observable<any> {
    const options = {
        headers: new HttpHeaders(),
    };
    options.headers.append('Content-Type', 'multipart/form-data');
    options.headers.append('Accept', 'application/json');

    const data = new FormData();
    data.append('attachment', file);

    return this.httpClient.post<any>(`${this.apiUrl}/attach?room_id=${roomId}`, data, options).pipe(
        catchError(error => this.handleError(error, false)),
    );
}

  public getAttachInfo(binaryName: string): Observable<User> {
    return this.httpClient.get<{ user: User }>(`${this.apiUrl}/attach/${binaryName}/info`).pipe(
      catchError(error => this.handleError(error, false)),
    );
  }

  public getSummary(
    groupId: number,
    roomId: number,
    topicId: number,
    isForce: boolean,
    ): Observable<any> {
    let url: string = `${this.apiUrl}/group/${groupId}/room/${roomId}/summary?offset=0&limit=100&force=${isForce}`;

    if (topicId) { 
      url += `&topic_id=${topicId}`;
    }

    return this.httpClient.get<any>(url).pipe(
      catchError(error => this.handleError(error, false)),
    );
  }

  public getChats(
    groupId: number,
    roomId: number,
    topicId: number,
    date: Date,
    offset: number = 0,
    isFuture: boolean = false,
    limit: number = 30,
    ): Observable<{
      isFuture: boolean,
      chats: Chat[],
    }> {
    const dateTimestamp: number = date.getTime() / 1000;
    let url: string = `${this.apiUrl}/group/${groupId}/room/${roomId}/chat?offset=${offset}&limit=${limit}&date=${dateTimestamp}&future=${isFuture ? 1 : 0}`;

    if (topicId) { 
      url += `&topic_id=${topicId}`;
    }

    const result: any = {
      isFuture: isFuture as boolean,
      chats: null,
    }

    return this.httpClient.get<{ chats: Chat[] }>(
      url,
      {},
      ).pipe(
      map((value: { chats: Chat[] }) => {
        result.chats = value.chats;
        return result;
      }),
      catchError(error => this.handleError(error, false)),
    );
  }

  public startChat(userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/user/${userId}/chat`, {}).pipe(
      map((result: { group: Group }) => result.group),
      catchError(error => this.handleError(error)),
    );
  }

  public addFriend(userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/user/${userId}/friend`, {}).pipe(
      map(this.handleResponse),
      catchError(error => this.handleError(error)),
    );
  }

  public deleteFriend(userId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/user/${userId}/friend`, {}).pipe(
      map(this.handleResponse),
      catchError(error => this.handleError(error)),
    );
  }

  public signIn(formData: FormData): Observable<UserSimpleSet> {
    return this.httpClient.post<UserSimpleSet>(`${this.apiUrl}/user/signin`, formData);
  }

  public verify(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/user/verify`).pipe(
      map(this.handleResponse),
      catchError(error => this.handleError(error, false)),
    );
  }

  public getUser(id: number, isShowBigError: boolean = false): Observable<User> {
    return this.httpClient.get<{ user: User }>(`${this.apiUrl}/user/${id}`).pipe(
      map((value: { user: User }) => value.user),
      catchError(error => this.handleError(error, isShowBigError)),
    );
  }

  public handleResponse(value: any): any {
    return value;
  }

  public cancelHttpError(): void {
    this.httpErrorCode.next(null);
  }

  private handleError(error: HttpErrorResponse, isBig: boolean = true): Observable<any> {
    let isBigError: boolean = false;

    switch (error.status) {
      case 400:
        isBigError = isBig;
        this.matSnackBar.open(this.translateService.instant('HTTP_ERROR.400_BAD_REQUEST.DESCRIPTION'));
        break;
      case 401:
        if (!window.location.pathname?.includes('sign')) {
          this.router.navigateByUrl(`/signin?return=${window.location.pathname}`);
        }
        break;
      case 403:
        isBigError = isBig;
        this.matSnackBar.open(this.translateService.instant('HTTP_ERROR.403_FORBIDDEN.DESCRIPTION'));
        break;
      case 404:
        this.matSnackBar.open(this.translateService.instant('HTTP_ERROR.404_NOT_FOUND.DESCRIPTION'));
        isBigError = isBig;
        break;
      case 406:
      case 500:
      case 501:
      case 502:
      case 504:
        isBigError = isBig;
        break;
      default:
        this.matSnackBar.open(this.translateService.instant('ERROR.NETWORK.DESCRIPTION'));
        break;
    }

    if (isBigError) {
      this.httpErrorCode.next(error.status);
    }

    return throwError(error);
  }

}
