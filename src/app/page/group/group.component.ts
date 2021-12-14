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
  User,
} from 'src/app/model/type';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: [ './group.component.scss' ],
})
export class GroupComponent implements OnDestroy {

  public category: ChatSpaceCategory = ChatSpaceCategory.CHAT;
  public isShortWidth: boolean = false;
  public isShowDetailView: boolean = true;
  public groupId: number;
  public group: Group;

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
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params?.id;
        this.groupService.openGroup(this.groupId);
      }),
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
    ];
  }

  public get isShowRoomPanel(): boolean {
    return !this.isShortWidth || this.category === ChatSpaceCategory.ROOM;
  }

  public get isChatViewOpen(): boolean {
    return !this.isShortWidth || this.category === ChatSpaceCategory.CHAT;
  }

  public get isLiveViewOpen(): boolean {
    return !this.isShortWidth || this.category === ChatSpaceCategory.LIVE;
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

  public openChatView(): void {
    this.category = ChatSpaceCategory.CHAT;
  }

  public openRoomList(): void {
    this.category = ChatSpaceCategory.ROOM;
  }

  public openChat(): void {
    this.category = ChatSpaceCategory.CHAT;
  }

  public openLive(): void {
    this.category = ChatSpaceCategory.LIVE;
  }

  public openRoom(room: Room): void {
    this.groupService.openedRoom$.next(room);
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
