import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { take } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { Room } from 'src/app/model/type';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    standalone: false
})
export class SummaryComponent implements OnChanges {

  @Input()
  public room: Room;

  @Input()
  public topicId: string;

  @Input()
  public groupId: number;


  public spaceKey: string = null;


  public constructor(
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}
  
  public ngOnChanges(changes: any): void {
    if(changes.topicId) {
    this.summary();
    }
  }

  public summary(isForce: boolean = false): void {
    this.dataService.getSummary(
      this.room?.group_id,
      this.room?.id,
      this.topicId,
      isForce,
      ).pipe(take(1)).subscribe(
        (result: any) => {
          this.spaceKey = result?.spaceKey;
          console.log(this.spaceKey, result);
          this.changeDetectorRef.markForCheck();
    });

  }
  
  public onClickReSummarize(): void {
    this.spaceKey = null;
    this.summary(true);
  }
  

}
