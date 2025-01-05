import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Util } from 'src/app/core/util';
import {
  Group,
  Relation,
  User,
} from 'src/app/model/type';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
    standalone: false
})
export class ProfilePageComponent implements OnDestroy {

  public user: User;
  public isLoading: boolean = true;
  public relation: Relation;

  private subscriptions: Subscription[] = [];

  public constructor(
    private identityService: IdentityService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {
    this.subscriptions.push(
      this.route.params.subscribe(() => {
        this.init();
      }),
    );
  }

  public get isMe(): boolean {
    return this.user.id === this.identityService.id;
  }

  public init(): void {
    const userId: number = this.route.snapshot.params.id;
    this.fetch(userId);

  }

  public fetch(id: number): void {
    this.dataService.getUser(id, true).subscribe((user: User) => {
      this.user = user;
      this.relation = user.relation;
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  public onMessageClick(): void {
    this.dataService.startChat(this.user.id).pipe(take(1)).subscribe((group: Group | null) => {
      this.router.navigateByUrl(`/group/${group.id}`);
    });
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
