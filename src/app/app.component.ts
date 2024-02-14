import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Subscription,
  take,
} from 'rxjs';
import { DataService } from './core/data.service';
import { IdentityService } from './core/identity.service';
import { LayoutService } from './core/layout.service';
import { Util } from './core/util';
import {
  Attach,
  User,
  WindowSizeWidth,
} from './model/type';
import { ViewerService } from './core/viewer.service';
import { NetworkService } from './core/network.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { LocalSettingService } from './core/local-setting.service';
import { PushMessageService } from './core/push-message.service';
import { v4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'SurReal';
  public pageErrorCode: number;
  public isSmallWidth: boolean = false;
  public isSideNavEnlarged: boolean = false;
  public isViewerOpen: boolean = true;
  public notificationDialogRef: MatDialogRef<ConfirmComponent>;

  private MOBILE_WIDTH: number = WindowSizeWidth.MOBILE;
  private subscriptions: Subscription[] = [];

  public constructor(
    public translateService: TranslateService,
    public dataService: DataService,
    public elementRef: ElementRef,
    public identityService: IdentityService,
    private viewerService: ViewerService,
    private layoutService: LayoutService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private localSettingService: LocalSettingService,
    private networkService: NetworkService,
    private matSnackBar: MatSnackBar,
    private pushMessageService: PushMessageService,
    public matDialog: MatDialog,
  ) {
    translateService.setDefaultLang(this.getLanguageCode());
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        this.pageErrorCode = code;
      }),
    );
    this.subscriptions.push(
      this.identityService.user$.subscribe((user: User) => {
        if (user !== undefined && this.localSettingService.isUserGrantNotification) {
          this.registerClient();
        }
      }),
    );
    this.subscriptions.push(
      this.router.events.subscribe((event: any) => {
        if ( event instanceof NavigationEnd ) {
          this.isSideNavEnlarged = event?.url === '/' || event?.url === '/main';
          this.viewerService.close();
          this.changeDetectorRef.detectChanges();
        }
      }),
    );
    this.subscriptions.push(
      this.viewerService.attaches$.subscribe((attaches: Attach[]) => {
        this.isViewerOpen = attaches !== undefined;
    }),
    this.networkService.isConnected$.subscribe((isConnected: boolean) => {

      if (!isConnected) {
        const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = this.matSnackBar.open(
          this.translateService.instant('ERROR.NETWORK.DESCRIPTION'),
          null, 
          { duration: 0 },
        );
      } else {
        this.matSnackBar.dismiss(); 
      }
    }),

      
    );

    this.networkService.startService();
  }

  public get isSignedIn(): boolean {
    return this.identityService.isSignedIn;
  }

  public get isSideNavOpen(): boolean {
    return this.layoutService.isSideNavOpen;
  }

  public set isSideNavOpen(isOpen: boolean) {
    this.layoutService.isSideNavOpen = isOpen;
  }

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: any) {
    if(this.isViewerOpen) {
      this.viewerService.close();
    }

  }

  public registerClient(): void {
    this.pushMessageService.getToken().then((token: string) => {
      const key: string = this.localSettingService.get('client_id') || v4().toString();

      this.dataService.postClient(key, token).pipe(take(1)).subscribe((res: any) => {
        this.localSettingService.set('client_id', res?.id);
      });
    });
  }

  public closeSideNav(): void {
    this.isSideNavOpen = false;
    this.changeDetectorRef.markForCheck();
  }

  public shouldSideNavOpen(): boolean {
    return (this.isSideNavOpen || !this.isSmallWidth) && this.isSignedIn;
  }

  public getDrawerContainerClass(): string {
    if (this.isSideNavEnlarged) {
      return 'drawer-container-large';
    }

    if (this.isSideNavOpen || !this.isSmallWidth) {
      return 'drawer-container'
    }

    return 'hide';
  }

  public ngOnInit(): void {
    this.openNotificationPermissionDialog();
    this.isSmallWidth = window.innerWidth < this.MOBILE_WIDTH;
    this.openNotificationPermissionDialog();
  }

  public openNotificationPermissionDialog(): boolean {
    if(
      !this.isSignedIn ||
      (
        'Notification' in window &&
        (
          Notification.permission === 'denied' ||
        Notification.permission === 'granted'
        )
      )||
      this.localSettingService.isUserDisallowedNotification
      ) {
      return false;
    }

    this.notificationDialogRef = this.matDialog.open(ConfirmComponent, {
      maxWidth: '600px',
      minWidth: '280px',
      data: {
        title: this.translateService.instant('PERMISSION.NOTIFICATION.TITLE'),
        message: this.translateService.instant('PERMISSION.NOTIFICATION.MESSAGE'),
        positiveText: this.translateService.instant('PERMISSION.NOTIFICATION.ALLOW'),
        negativeText: this.translateService.instant('PERMISSION.NOTIFICATION.CANCEL'),
      },
      maxHeight: '90vh',
    });

    this.notificationDialogRef.afterClosed().subscribe((result: any) => {
      this.localSettingService.set('notification_permission', result?.option);

      if(result?.option) {
        this.localSettingService.requestNotificationPermission().then(() => {
          this.pushMessageService.init().then(() => {
            this.registerClient();
          });
        });
      }

    });

    return true;

  }

  public onWindowResize(event: any): void {
    this.isSmallWidth = event.target.innerWidth < this.MOBILE_WIDTH;
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
    this.isSideNavOpen = true;
  }

  public toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    this.changeDetectorRef.markForCheck();
  }

  public getLanguageCode(): string {
    const languageCode: string = this.translateService.getBrowserLang();
    const supportedLangs: string[] = [ 'en', 'ko' ];

    if (supportedLangs.some(v => {
      return languageCode.includes(v);
    })) {
      return languageCode;
    }

    return 'en';
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
