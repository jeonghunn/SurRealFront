import {
  Component,
  OnDestroy,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { LayoutService } from 'src/app/core/layout.service';
import { Util } from 'src/app/core/util';
import {
  ChatSpaceCategory,
  FileContainer,
  Group,
  Room,
} from 'src/app/model/type';
import { FileHandle } from 'src/app/core/directive/drag-drop.directive';
import { RoomService } from 'src/app/core/room.service';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    standalone: false
})
export class GroupComponent implements OnDestroy {

  public category: ChatSpaceCategory = ChatSpaceCategory.CHAT;
  public isShortWidth: boolean = false;
  public isSideNavOpen: boolean = false;
  public isShowDetailView: boolean = true;
  public groupId: number;
  public room: Room;
  public group: Group;

  files: FileHandle[] = [];

  public headerStyle: any = {
    'margin-left': '80px',
    'border-left': 'solid 1px rgba(0, 0, 0, 0.12)',
  };

  public readonly chatSpaceCategory: typeof ChatSpaceCategory = ChatSpaceCategory;

  private subscriptions: Subscription[] = [];

  public constructor(
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private roomService: RoomService, 
    private router: Router,
    private identityService: IdentityService,
  ) {

    this.subscriptions = [
      this.groupService.openedGroup$.subscribe((group: Group) => {
        this.group = group;
        this.roomService.clearFiles();
      }),
      this.groupService.openedRoom$.subscribe((room: Room | null) => {
        this.room = room;
        this.category = room ? ChatSpaceCategory.CHAT : ChatSpaceCategory.ROOM;
      }),
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params?.id;
        this.groupService.open(this.groupId, params?.room_id);
      }),
      this.layoutService.windowResize$.subscribe(window => {
        this.isShortWidth = this.layoutService.isShortWidth();
      }),
      this.layoutService.isSideNavOpen$.subscribe((isSideNavOpen: boolean) => {
        this.isSideNavOpen = isSideNavOpen;
      }),
      this.groupService.toggleViewAll$.subscribe(() => {
        this.open(ChatSpaceCategory.ROOM);
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

  public get color(): string {
    if (this.group?.target_id === null || this.group?.target_id === this.userId) {
      return null;
    }

    return this.group?.target?.color;
  }

  public onFileDrop(files: FileContainer[]): void {
    this.roomService.addFiles(files);
  }

  public isViewActive(category: ChatSpaceCategory): boolean {
    return !this.isShortWidth || this.category === category;
  }

  public open(category: ChatSpaceCategory): void {
    this.category = category;
  }

  public openRoom(room: Room): void {
    this.groupService.openRoom(this.groupId, room?.id);
  }

  public ngOnDestroy(): void {
    this.groupService.close();
    Util.unsubscribe(...this.subscriptions);
  }
}
