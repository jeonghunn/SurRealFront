import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  Subscription,
  catchError,
  take,
} from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { Topic } from 'src/app/model/type';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnChanges {

  public selectedApp: string = null;

  @Input()
  public topic: Topic = null;

  @Input()
  public groupId: number = null;

  @Input()
  public roomId: number = null;

  public space: any = null;
  public subscriptions: Subscription[] = [];

  public isLoading: boolean = false;

  public title: string;

  public constructor(
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.topic) {
      this.getSpace();
    }    
  }

  public getSpace(): void {
    if(!this.topic?.space) {
      return;
    }

    this.dataService.getSpace(this.groupId, this.roomId, this.topic.space?.key).pipe(
      take(1),
    ).subscribe((result: any) => {
      this.space = result;
      this.selectedApp = result?.category;
      this.changeDetectorRef.markForCheck();
    });
  }

  public selectApp(app: string): void {
    this.selectedApp = app;
  }

  public onCancelButtonClick(): void {
    this.selectedApp = null;
  }

  public setLoader(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.changeDetectorRef.markForCheck();
  }

  public goToTopic(topicId: number): void {
    this.router.navigate([`/group/${this.groupId}/chat/${this.roomId}/topic/${topicId}`]);
  }

  public onCreateButtonClick(): void {
    this.isLoading = true;

    this.dataService.createTopic(
      this.groupId,
      this.roomId,
      null,
      this.title,
      this.selectedApp,
      ).pipe(
        take(1),
        catchError((error) => {
          this.setLoader(false);
          return new Observable<never>(observer => {
            observer.error(error);
            observer.complete();
          });
        }),
        ).subscribe((result: {
          topic: Topic,
          space: any,
        }) => {
      this.selectedApp = result?.space?.category;
      this.setLoader(false);
      this.selectedApp = null;
      // this.title = null;
      // this.topic = result?.topic;
      // this.space = result?.space;
    });
  }

}
