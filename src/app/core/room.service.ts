import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
} from 'rxjs';
import {
  AuthMessage,
  Chat,
  FileContainer,
} from 'src/app/model/type';
import { DataService } from './data.service';
import {
  WebSocketSubject,
  webSocket,
} from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public liveRoomContent$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  public uploadFiles$: BehaviorSubject<FileContainer[]> = new BehaviorSubject<FileContainer[]>([]);
  public lastOtherChat$: Subject<Chat> = new BehaviorSubject<Chat>(null);
  public clipboardChat$: Subject<Chat> = new BehaviorSubject<Chat>(null);
  public spaceWebSocketSubject$: WebSocketSubject<any> = null;
  public isSpaceConnected: boolean = false;
  public isAuthenticated: boolean = false;
  public reAuthDelay: number = 100;
  public connectCount: number = 0;
  public reconnectDelay: number = 0;


  public constructor(
    private dataService: DataService,
    private identityService: IdentityService,
  ) { }

  public setLiveRoomContent(data: any): void {
    this.liveRoomContent$.next(data);
  }
  public addFiles(files: FileContainer[]): void {
    const currentFiles = this.uploadFiles$.getValue();
    this.uploadFiles$.next(currentFiles.concat(files));
  }

  public pushOtherChat(chat: Chat): void {
    this.lastOtherChat$.next(chat);
  }
  
  public clearFiles(): void {
    this.uploadFiles$.next([]);
  }

  public deleteAttachByUrl(url: string): void {
    const currentFiles: FileContainer[] = this.uploadFiles$.getValue();
    const files: FileContainer[] = currentFiles.filter((file: FileContainer) => file.url !== url);
    this.uploadFiles$.next(files);
  }

  public sendAuthMessage(): void {
    const auth: AuthMessage = new AuthMessage(this.identityService.auth);
    this.spaceWebSocketSubject$.next(auth);
  }

  public onAuthResultReceived(isSuccess: boolean): void {
    if (isSuccess) {
      this.isAuthenticated = true;
      return;
    }

    setTimeout(() => {
      console.log('[Auth] Retry to send auth message.');
      this.sendAuthMessage();
      this.reAuthDelay = this.reAuthDelay * 2;
    }, this.reAuthDelay);
  }

  public closeSpaceWebSocket(): void {
    this.spaceWebSocketSubject$?.complete();
    this.spaceWebSocketSubject$?.unsubscribe();
    this.spaceWebSocketSubject$ = null;
    this.isSpaceConnected = false;
    this.connectCount = 0;
  }
  
  public initSpaceWebSocket(roomId: number, key: string): void {
    this.spaceWebSocketSubject$?.complete();
    this.spaceWebSocketSubject$?.unsubscribe();

    this.spaceWebSocketSubject$ = webSocket({
      url: `${environment.socketServerUrl}${roomId}/space/${key}`,
      deserializer: (message) => {
        //this.resetFutureCriteria();
        return this.dataService.deserializeSocketMessage(message);
      },
      serializer: message => this.dataService.serializeSocketMessage(message),
      openObserver: {
        next: value => {
          if (!this.isSpaceConnected && this.connectCount > 0) {
            console.log('its about time to load sp chats');
           // this.fetchFutureChats();
          } else {
            this.sendAuthMessage();
          }

          this.isSpaceConnected = true;
          this.connectCount++;
          this.reconnectDelay = 1000;
        },
        error: value => {
          //this.onConnectionError(value);
        },
      },
    });


  }

}
