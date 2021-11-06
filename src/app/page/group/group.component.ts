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
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import {
  ChatSpaceCategory,
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
  public isShowDetailView: boolean = true;
  public groupId: number;

  private subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private groupService: GroupService,
  ) {

    this.subscriptions = [
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params?.id;
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
