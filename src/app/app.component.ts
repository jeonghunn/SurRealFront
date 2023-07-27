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
import { Subscription } from 'rxjs';
import { DataService } from './core/data.service';
import { IdentityService } from './core/identity.service';
import { LayoutService } from './core/layout.service';
import { Util } from './core/util';
import {
  Attach,
  WindowSizeWidth,
} from './model/type';
import { ViewerService } from './core/viewer.service';
import { NetworkService } from './core/network.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'SurReal';
  public pageErrorCode: number;
  public isSmallWidth: boolean = false;
  public isSideNavEnlarged: boolean = true;
  public isViewerOpen: boolean = true;

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
    private networkService: NetworkService,
    private matSnackBar: MatSnackBar,
  ) {
    translateService.setDefaultLang(this.getLanguageCode());
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        this.pageErrorCode = code;
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
      this.viewerService.attach$.subscribe((attach: Attach) => {
        this.isViewerOpen = attach !== undefined;
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
    this.isSmallWidth = window.innerWidth < this.MOBILE_WIDTH;
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
