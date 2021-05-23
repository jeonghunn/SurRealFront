import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: [ './profile-icon.component.scss' ],
})
export class ProfileIconComponent implements OnChanges {

  @Input()
  public length: number = 64;

  @Input()
  public isClickable: boolean = true;

  public style: any = {
    height: 64,
    width: 64,
  };

  public constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges(): void {
    this.style = {
      height: `${this.length}px`,
      width: `${this.length}px`,
      borderRadius: `${this.length}px`,
      cursor: this.isClickable ? 'pointer' : 'unset',
    };
    this.changeDetectorRef.markForCheck();
  }

}
