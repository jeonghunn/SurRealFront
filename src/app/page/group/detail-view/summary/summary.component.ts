import {
  ChangeDetectorRef,
  Component,
  Input,
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
export class SummaryComponent implements OnInit {

  @Input()
  public room: Room;

  @Input()
  public topicId: number;

  public title: string;
  public result: string;


  public constructor(
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}
  
  public ngOnInit(): void {
    this.summary();
  }

  public summary(): void {
    this.dataService.getSummary(
      this.room?.group_id,
      this.room?.id,
      this.topicId,
      ).pipe(take(1)).subscribe(
        (response: string) => {
          this.title = response.substring(0, response.indexOf('\n'));
          this.result = response.substring(response.indexOf('\n') + 1);

          this.changeDetectorRef.markForCheck();
  });
  }
  
  

}
