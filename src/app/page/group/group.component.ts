import {
  Component,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from 'src/app/core/responsive.service';
import { Util } from 'src/app/core/util';
import { ChatSpaceCategory } from 'src/app/model/type';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: [ './group.component.scss' ],
})
export class GroupComponent implements OnDestroy {

  public category: ChatSpaceCategory = ChatSpaceCategory.CHAT;
  public isShortWidth: boolean = false;
  public isShowDetailView: boolean = true;

  private subscriptions: Subscription[] = [];

  public constructor(
    private responsiveService: ResponsiveService,
  ) {

    this.subscriptions = [
      this.responsiveService.windowResize$.subscribe(window => {
        this.isShortWidth = this.responsiveService.isShortWidth();
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

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
