import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
} from 'rxjs';
import {
  Chat,
  FileContainer,
} from 'src/app/model/type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public liveRoomContent$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  public uploadFiles$: BehaviorSubject<FileContainer[]> = new BehaviorSubject<FileContainer[]>([]);
  public lastOtherChat$: Subject<Chat> = new BehaviorSubject<Chat>(null);


  public constructor(
    private dataService: DataService,
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

}
