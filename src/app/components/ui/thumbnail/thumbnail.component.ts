import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SecurityContext,
} from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: [ './thumbnail.component.scss' ],
})
export class ThumbnailComponent implements OnChanges {

  @Input()
  public length: number = 64;

  @Input()
  public src: string;

  @Input()
  public isClickable: boolean = true;

  public style: any = {
    height: 64,
    width: 64,
  };

  public isPlaceHolder: boolean = false;

  public constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges(): void {
    if (!this.src?.includes('://')) {
      this.isPlaceHolder = true;
    }

    this.style = {
      height: `${this.length}px`,
      width: `${this.length}px`,
      borderRadius: `8px`,
      cursor: this.isClickable ? 'pointer' : 'unset',
      backgroundImage: this.isPlaceHolder ? null : `url(${this.src})`,
      lineHeight: `${this.length}px`,
    };
    this.changeDetectorRef.markForCheck();
  }

}
