import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import {
  Group,
  User,
} from 'src/app/model/type';
import { FriendMenuComponent } from 'src/app/components/friend-button/friend-menu/friend-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileIconComponent } from '../ui/profile-icon/profile-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FriendMenuComponent,
      ProfileIconComponent,
      MatMenuModule,
      MatIconModule,
      MatButtonModule,
    ],
})
export class UserProfileComponent {

  @Input()
  public user: User = null;

  @Output()
  public readonly update: EventEmitter<null> = new EventEmitter<null>();

  public constructor(
    private router: Router,
    private dataService: DataService,
    private identityService: IdentityService,
  ) {
  }

  public get isMe(): boolean {
    return this.user.id === this.identityService.id;
  }

  public onProfileClick(): void {
    this.router.navigateByUrl(`/user/${this.user.id}`);
  }

  public deleteFriend(): void {
    this.dataService.deleteFriend(this.user.id).pipe(take(1)).subscribe(() => {
      this.update.emit();
    });
  }

  public onMessageClick(): void {
    this.dataService.startChat(this.user.id).pipe(take(1)).subscribe((group: Group | null) => {
      this.router.navigateByUrl(`/chat/${group.id}`);
    });
  }

}
