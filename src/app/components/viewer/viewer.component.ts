import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Util } from 'src/app/core/util';
import { ViewerService } from 'src/app/core/viewer.service';
import {
  Attach,
  AttachType,
} from 'src/app/model/type';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnChanges, OnDestroy {

  public attachType: typeof AttachType = AttachType;
  private subscriptions: Subscription[] = [];
  public attach: Attach;


  public constructor(
    private viewerService: ViewerService,
  ) {
    this.subscriptions = [
      this.viewerService.attach$.subscribe((attach: Attach) => {
        this.attach = attach;
      }),
    ];
  }
  
  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public onCloseClick(event: MouseEvent): void {
    this.viewerService.close();
  }

  public onDownloadClick(event: MouseEvent, attach: Attach): boolean {
    event.preventDefault();
    window.open(attach.url, "_blank");

    return false;
  }

  public ngOnChanges(): void {
    console.log(this.attach);


  }

}
