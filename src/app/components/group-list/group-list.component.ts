import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Util } from 'src/app/core/util';
import {
  Group,
  User,
} from 'src/app/model/type';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ],
})
export class GroupListComponent implements OnDestroy {

  @Output()
  public readonly toggleSidNav: EventEmitter<null> = new EventEmitter();

  public groups: Group[] = [];

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private router: Router,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
    private identityService: IdentityService,
    private groupService: GroupService,
  ) {

    this.subscriptions = [
      this.identityService.user$.subscribe((user: User) => {
        this.groupService.fetchGroupList();
      }),
      this.groupService.groups$.subscribe((groups: Group[]) => {
        this.groups = groups;
        this.changeDetectorRef.markForCheck();
      }),
    ];

  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public go(url: string): void {
    this.router.navigateByUrl(url).then(r => {
      this.toggleSidNav.emit();
    });
  }

  public onGroupClick(id: number): void {
    this.router.navigateByUrl(`/chat/${id}`);
  }

}
