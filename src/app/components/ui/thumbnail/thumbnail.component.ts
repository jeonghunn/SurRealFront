import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SecurityContext,
} from '@angular/core';
import {
  Subscription,
  take,
} from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { Util } from 'src/app/core/util';

@Component({
    selector: 'app-thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.scss'],
    animations: [
        trigger('glow', [
            state('true', style({
                boxShadow: '0 0 16px 0px var(--glow-color)',
            })),
            state('false', style({
                boxShadow: '0 0 0px 0px var(--glow-color)',
            })),
            transition('true => false', animate('500ms ease-in')),
            transition('false => true', animate('500ms ease-out')),
        ]),
    ],
    standalone: false
})
export class ThumbnailComponent implements OnChanges, OnInit, OnDestroy {

  @Input()
  public length: number = 64;

  @Input()
  public src: string;

  @Input()
  public chatId: string;

  @Input()
  public attachId: string;

  @Input()
  public isClickable: boolean = true;

  @Input()
  public percentage: number = 100;

  @Input()
  public key: string;

  public isGlowing: boolean = false;

  public style: any = {
    height: 64,
    width: 64,
  };

  public isPlaceHolder: boolean = false;
  public subscriptions: Subscription[] = [];

  public constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public dataService: DataService,
  ) {
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.isGlowing = false;
    }, 2000);
   
    if (this.key) {
      this.subscriptions.push(
        this.dataService.transferProgresses$.subscribe((progresses: any) => {
          const progress: number = progresses[this.key];
          if (progress) {
            console.log('thumbnail update', progress);
            this.percentage = progress;
            this.changeDetectorRef.markForCheck();
          }

          if (progress === 100) {
            this.isGlowing = true;
            this.changeDetectorRef.markForCheck();

            setTimeout(() => {
              this.isGlowing = false;
              this.changeDetectorRef.markForCheck();
            }, 1000);

            this.changeDetectorRef.markForCheck();
          }
        }));   
    }
  }

  public ngOnDestroy(): void {
    Util.unsubscribe(...this.subscriptions);
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

        if (retry++ < 4) {
          setTimeout(() => {
            image.src = this.src;
            delay += 500;
          }, delay);

          return;
        }
        
        if (retry === 5) {
          this.dataService.refreshChat(this.chatId).pipe(take(1)).subscribe((result: any) => {
            this.initStyle(`url(${result?.meta?.attaches})`);
            this.changeDetectorRef.markForCheck();
          });
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
