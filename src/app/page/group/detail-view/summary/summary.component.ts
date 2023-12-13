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
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnChanges {

  @Input()
  public room: Room;

  @Input()
  public topicId: number;

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

  public summary(): void {
    this.dataService.getSummary(
      this.room?.group_id,
      this.room?.id,
      this.topicId,
      ).pipe(take(1)).subscribe(
        (result: any) => {
          this.spaceKey = result?.spaceKey;
          console.log(this.spaceKey, result);
          this.changeDetectorRef.markForCheck();
    });

  }
  
  

}
