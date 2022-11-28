import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgxSkeletonLoaderConfig } from 'ngx-skeleton-loader/lib/ngx-skeleton-loader-config.types';
import darkPalette from '../../../palette';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input()
  public count: number = 1;

  @Input()
  public height: string | null;

  @Input()
  public width: string | null;

  public animation: any = 'progress';

  public style: any = {};

  public constructor() { }

  public ngOnInit(): void {

    const prefersDark: boolean =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      this.style['backgroundColor'] = darkPalette.SKELETON_LOADER;
      this.animation = 'progress-dark';
    }

    if (this.height) {
      this.style['height'] = this.height;
    }

    if (this.width) {
      this.style["width"] = this.width;
    }

  }

}
