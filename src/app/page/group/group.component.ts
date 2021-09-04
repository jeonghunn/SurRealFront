import {
  Component,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from 'src/app/core/responsive.service';
import { Util } from 'src/app/core/util';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: [ './group.component.scss' ],
})
export class GroupComponent implements OnDestroy {

  public isRoomPanelOpen: boolean = false;
  public isShortWidth: boolean = false;
  public isShowDetailView: boolean = true;

  private subscriptions: Subscription[] = [];

  public constructor(
    private responsiveService: ResponsiveService,
  ) {

    this.subscriptions = [
      this.responsiveService.windowResize$.subscribe(window => {
        this.isShortWidth = this.responsiveService.isShortWidth();
      }),
    ];
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }
}
