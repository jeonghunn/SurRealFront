import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { Relation } from 'src/app/model/type';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SpinnerComponent } from 'src/ui/spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-friend-list',
    templateUrl: './friend-list.component.html',
    styleUrls: ['./friend-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        UserProfileComponent,
        SpinnerComponent,
    ],
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
