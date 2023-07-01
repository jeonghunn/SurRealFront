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


    this.initStyle();
    
    if (!this.isPlaceHolder) {
      let delay: number = 0;
      let retry: number = 0;
      const image = new Image();
      image.src = this.src;
      image.onload = () => {
        this.initStyle(`url(${this.src})`);
        this.changeDetectorRef.markForCheck();
      }

      image.onerror = () => {

        if (retry++ < 10) {
          setTimeout(() => {
            image.src = this.src;
            delay += 500;
          }, delay);
        }

      }
    }

    this.changeDetectorRef.markForCheck();
  }

  public initStyle(backgroundImage: string = null): void {
    this.style = {
      height: `${this.length}px`,
      width: `${this.length}px`,
      borderRadius: `8px`,
      backgroundImage,
      cursor: this.isClickable ? 'pointer' : 'unset',
      lineHeight: `${this.length}px`,
    };
  }

}
