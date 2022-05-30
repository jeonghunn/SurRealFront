import {
  Component,
  OnDestroy,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import {
  ChatSpaceCategory,
  Group,
  Room,
} from 'src/app/model/type';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: [ './group.component.scss' ],
})
export class GroupComponent implements OnDestroy {

  public category: ChatSpaceCategory = ChatSpaceCategory.CHAT;
  public isShortWidth: boolean = false;
  public isSideNavOpen: boolean = false;
  public isShowDetailView: boolean = true;
  public groupId: number;
  public room: Room;
  public group: Group;

  public headerStyle: any = {
    'margin-left': '80px',
    'border-left': 'solid 1px rgba(0, 0, 0, 0.12)',
  };

  public readonly chatSpaceCategory: typeof ChatSpaceCategory = ChatSpaceCategory;

  private subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private groupService: GroupService,
    private identityService: IdentityService,
  ) {

    this.subscriptions = [
      this.groupService.openedGroup$.subscribe((group: Group) => {
        this.group = group;
      }),
      this.groupService.openedRoom$.subscribe((room: Room | null) => {
        this.room = room;
        this.category = room ? ChatSpaceCategory.CHAT : ChatSpaceCategory.INFO;
      }),
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params?.id;
        this.groupService.openGroup(this.groupId);
      }),
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
      this.layoutService.isSideNavOpen$.subscribe((isSideNavOpen: boolean) => {
        this.isSideNavOpen = isSideNavOpen;
      }),
    ];
  }

  public get userId(): number {
    return this.identityService.id;
  }

  public get name(): string {
    if (this.group?.target_id === null || this.group?.target_id === this.userId) {
      return this.group.name;
    }

    return this.group?.target?.name;
  }

  public isViewActive(category: ChatSpaceCategory): boolean {
    return !this.isShortWidth || this.category === category;
  }

  public open(category: ChatSpaceCategory): void {
    this.category = category;
  }

  public openRoom(room: Room): void {
    this.groupService.openRoom(room?.group_id, room?.id);
  }

  public ngOnDestroy(): void {
    this.groupService.openedRoom$.next(null);
    Util.unsubscribe(...this.subscriptions);
  }
}
