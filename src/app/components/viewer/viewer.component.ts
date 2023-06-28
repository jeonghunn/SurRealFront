import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Attach } from 'src/app/model/type';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnChanges {

  @Input()
  public attach: Attach;

  @Output()
  public readonly viewerClose: EventEmitter<null> = new EventEmitter<null>();

  public onCloseClick(event: MouseEvent): void {
    this.viewerClose.emit();
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
