import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileContainer } from 'src/app/model/type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  public liveRoomContent$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  public uploadFiles$: BehaviorSubject<FileContainer[]> = new BehaviorSubject<FileContainer[]>([]);

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

  public clearFiles(): void {
    this.uploadFiles$.next([]);
  }

}
