import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from './core/data.service';
import { IdentityService } from './core/identity.service';
import { LayoutService } from './core/layout.service';
import { Util } from './core/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'SurRealClient';
  public pageErrorCode: number;
  public isSmallWidth: boolean = false;

  private MOBILE_WIDTH: number = 600;
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
    translateService.setDefaultLang(translateService.getBrowserLang() || 'en');
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        this.pageErrorCode = code;
      }),
    );
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

  public ngOnInit(): void {
    this.isSmallWidth = window.innerWidth < this.MOBILE_WIDTH;
    this.isSideNavOpen = this.isSmallWidth;
  }

  public onWindowResize(event: any): void {
    this.isSmallWidth = event.target.innerWidth < this.MOBILE_WIDTH;
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
  }

  public toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
