import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { WindowSizeWidth } from './model/type';

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

  private MOBILE_WIDTH: number = WindowSizeWidth.MOBILE;
  private subscriptions: Subscription[] = [];

  public constructor(
    public translateService: TranslateService,
    public dataService: DataService,
    public elementRef: ElementRef,
    public identityService: IdentityService,
    private layoutService: LayoutService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    translateService.setDefaultLang(this.getLanguageCode());
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        this.pageErrorCode = code;
      }),
    );
    this.subscriptions.push(
      this.router.events.subscribe((event: RouterEvent) => {
        if ( event instanceof NavigationEnd ) {
          this.isSideNavEnlarged = event?.url === '/' || event?.url === '/main';
          this.changeDetectorRef.detectChanges();
        }
      }),
    )
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
