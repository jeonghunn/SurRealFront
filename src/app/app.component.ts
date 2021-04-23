import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Util } from './core/util';
import {DataService} from './core/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnDestroy {
  public title: string = 'SurRealClient';
  public pageErrorCode: number;

  private subscriptions: Subscription[] = [];

  public constructor(
    public translateService: TranslateService,
    public dataService: DataService,
  ) {
    translateService.setDefaultLang(translateService.getBrowserLang());
    this.subscriptions.push(
      this.dataService.httpErrorCode.subscribe((code: number) => {
        console.log("asdfasdfasdfasdf");
        this.pageErrorCode = code;
      }),
    );
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
