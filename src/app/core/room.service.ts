import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../model/type';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public liveRoomContent$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  public uploadFiles$: BehaviorSubject<File[]> = new BehaviorSubject<File[]>([]);

  public constructor(
    private dataService: DataService,
  ) { }

  public setLiveRoomContent(data: any): void {
    this.liveRoomContent$.next(data);
  }
  public addFiles(files: File[]): void {
    const currentFiles = this.uploadFiles$.getValue();
    this.uploadFiles$.next(currentFiles.concat(files));
  }

}
