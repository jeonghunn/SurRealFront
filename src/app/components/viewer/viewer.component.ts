import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Subscription,
  delay,
  take,
} from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { Util } from 'src/app/core/util';
import { ViewerService } from 'src/app/core/viewer.service';
import {
  Attach,
  AttachStatus,
  AttachType,
} from 'src/app/model/type';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnDestroy {

  public attachType: typeof AttachType = AttachType;
  private subscriptions: Subscription[] = [];
  public attaches: Attach[];
  public currentAttach: Attach;
  public currentIndex: number;
  public attachStatus: typeof AttachStatus = AttachStatus;
  public imageStyle: any = {
    maxHeight: '80%',
  };
  public isImageExpanded: boolean = false;
  public attachInfoRequestCount: number = 0;
  public isClosed: boolean = false;

  public constructor(
    private viewerService: ViewerService,
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    private elementRef: ElementRef,
  ) {
    this.subscriptions = [
      this.viewerService.attaches$.subscribe((attaches: Attach[]) => {
        this.attaches = attaches;
      }),
      this.viewerService.index$.subscribe((index: number) => {
        if (!this.attaches) {
          return;
        }

        const attach: Attach = this.attaches[index];
        this.currentAttach = attach;
        this.currentIndex = index;

        console.log('currentAttach', this.currentAttach);

        this.loadVideo(attach);

      }),
    ];
  }
  
  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
  }

  public onCloseClick(event: MouseEvent): void {
    this.isClosed = true;
    this.viewerService.close();
  }
  
  public loadVideo(attach: Attach): void {
    if ((attach?.type === AttachType.VIDEO && this.attachInfoRequestCount === 0) ||
    attach?.status === AttachStatus.PROCESSING) {
      this.dataService.getAttachInfo(attach.binary_name).pipe(
        delay(this.attachInfoRequestCount === 0 ? 0 : 5000),
        take(1),
      ).subscribe((videoAttach: Attach) => {
        if (this.isClosed) {
          return;
        }

        this.attachInfoRequestCount++;
        this.currentAttach = videoAttach;
        this.attaches[this.currentIndex] = videoAttach;
        this.loadVideo(videoAttach);
      });
    }
  }

  public onBackgroundClick(event: MouseEvent): void {
    if(this.currentAttach.type === AttachType.VIDEO) {
      return;
    }
    this.onCloseClick(event);
  }


  public onImageClick(event: MouseEvent): void {
    event.stopPropagation();

    this.isImageExpanded = !this.isImageExpanded;
    this.imageStyle = !this.isImageExpanded ? {
      maxHeight: '80%',
    } : {};
    this.changeDetectorRef.markForCheck();
  }

  public onDownloadClick(event: MouseEvent, attach: Attach): boolean {
    event.preventDefault();
    window.open(attach.url, "_blank");

    return false;
  }

  public onArrowClick(event: MouseEvent, indexOffset: number): void {
    event.stopPropagation();
    this.viewerService.setIndex(this.currentIndex + indexOffset);
  }

}
