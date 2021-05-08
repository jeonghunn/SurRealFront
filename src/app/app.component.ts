import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from './core/data.service';
import { IdentityService } from './core/identity.service';
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
  ) {
    translateService.setDefaultLang(translateService.getBrowserLang());
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        this.pageErrorCode = code;
      }),
    );
  }

  public get isSignedIn(): boolean {
    return this.identityService.isSignedIn;
  }

  public ngOnInit(): void {
    this.isSmallWidth = window.innerWidth < this.MOBILE_WIDTH;
  }

  public onWindowResize(event: any): void {
    this.isSmallWidth = event.target.innerWidth < this.MOBILE_WIDTH;
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
