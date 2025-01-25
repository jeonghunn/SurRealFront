import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/core/group.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Util } from 'src/app/core/util';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output()
  public readonly toggleSidNav: EventEmitter<null> = new EventEmitter();

  @Input()
  public readonly isSmallWidth: boolean = false;

  public userFirstName: string;
  public currentGroupId: string = null;


  private subscriptions: Subscription[] = [];

  public constructor(
    public dialog: MatDialog,
    private identityService: IdentityService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private groupService: GroupService,
  ) {
    this.subscriptions = [
      this.identityService.user$.subscribe(() => {
        this.userFirstName = this.identityService.firstName;
      }),
      this.groupService.openedGroup$.subscribe((group) => {
        console.log('asdfasdf group', group);
        this.currentGroupId = group ? group.id : null;
      }),
    ];
  }

  public get isSignedIn(): boolean {
    return this.identityService.isSignedIn;
  }

  public ngOnInit(): void {
    if (this.identityService.isNeedToVerify) {

      this.changeDetectorRef.markForCheck();
    }
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public goAbout(): void {
    this.router.navigateByUrl('about').then(null);
  }

  public goSignIn(): void {
    this.router.navigateByUrl('signin').then(null);
  }

  public goSignUp(): void {
    this.router.navigateByUrl('signup').then(null);
  }

  public goSetting(): void {
    this.router.navigateByUrl('setting').then(null);
  }

  public goMyProfile(): void {
    this.router.navigateByUrl(`user/${this.identityService.id}`).then(null);
  }

  public onViewAllClick(): void {
    this.groupService.toggleViewAll$.next(true);
  }


  public onSideNavToggleClick(): void {
    this.toggleSidNav.emit();
  }

  public signOut(): void {
    this.identityService.remove();
    window.location.href = '/signin';
  }

}
