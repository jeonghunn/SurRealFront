import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { Relation } from 'src/app/model/type';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: [ './friend-list.component.scss' ],
})
export class FriendListComponent implements OnInit {

  public isLoading: boolean = true;
  public friends: Relation[] = [];
  public subscriptions: Subscription[] = [];

  public constructor(
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public fetch(): void {
    this.isLoading = true;
    this.dataService.getFriendList().pipe(take(1)).subscribe((friends: Relation[]) => {
      this.friends = friends;
      this.changeDetectorRef.markForCheck();
      this.isLoading = false;
    });
  }

  public ngOnInit(): void {
    this.fetch();
  }

}
