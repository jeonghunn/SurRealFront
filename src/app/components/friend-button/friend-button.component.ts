import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import {
  Relation,
  RelationCategory,
  RelationStatus,
  User,
} from 'src/app/model/type';
import { FriendMenuComponent } from './friend-menu/friend-menu.component';

@Component({
    selector: 'app-friend-button',
    templateUrl: './friend-button.component.html',
    styleUrls: ['./friend-button.component.scss'],
    standalone: true,
    imports: [
      MatMenuModule,
      FriendMenuComponent,
    ]
})
export class FriendButtonComponent implements OnChanges {

  @Input()
  public user: User;

  @Output()
  public readonly update: EventEmitter<null> = new EventEmitter<null>();

  @Input()
  public iconName: string = 'menu';

  public relation: Relation;
  public isRequestingFriend: boolean = false;

  public constructor(
    private dataService: DataService,
    public identityService: IdentityService,
  ) { }

  public get myUserId(): number {
    return this.identityService.id;
  }

  public get isFriend(): boolean {
    return this.relation?.category === RelationCategory.FRIEND && this.relation?.status === RelationStatus.NORMAL;
  }

  public get isFriendRequested(): boolean {
    return this.relation?.status === RelationStatus.REQUEST_RECEIVED;
  }

  public get isFriendRequestReceived(): boolean {
    return this.relation?.status === RelationStatus.PENDING && this.relation?.category === RelationCategory.FRIEND;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.relation = this.user.relation;
  }

  public addFriend(): void {
    this.isRequestingFriend = true;
    this.dataService.addFriend(this.user.id).pipe(take(1)).subscribe(() => {
      this.isRequestingFriend = false;
      this.update.emit();
    });
  }

  public deleteFriend(): void {
    this.isRequestingFriend = true;
    this.dataService.deleteFriend(this.user.id).pipe(take(1)).subscribe(() => {
      this.isRequestingFriend = false;
      this.update.emit();
    });
  }
}
