import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Util } from 'src/app/core/util';
import {
  Relation,
  User,
} from 'src/app/model/type';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: [ './profile-page.component.scss' ],
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
  ) {

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

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

}
