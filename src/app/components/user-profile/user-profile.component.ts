import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import {
  Group,
  User,
} from 'src/app/model/type';
import { IdentityService } from 'src/app/core/identity.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [ './user-profile.component.scss' ],
})
export class UserProfileComponent {

  @Input()
  public user: User = null;

  @Output()
  public readonly change: EventEmitter<null> = new EventEmitter<null>();

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
      this.change.emit();
    });
  }

  public onMessageClick(): void {
    this.dataService.startChat(this.user.id).pipe(take(1)).subscribe((group: Group | null) => {
      this.router.navigateByUrl(`/chat/${group.id}`);
    });
  }

}
