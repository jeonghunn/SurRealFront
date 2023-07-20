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

  @Input()
  public name: string;

  @Input()
  public color: string = null;

  public monogram: string;

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
      lineHeight: `${this.length}px`,
      fontSize: `${this.length / 2 - 4}px`,
      backgroundColor: this.color,
      color: this.color ? 'white' : null,
    };
    this.monogram = this.getMonogram(this.name);
    this.changeDetectorRef.markForCheck();
  }


  public getMonogram(name: string): string {
    if (!name) {
      return '';
    }

    const tokens: string[] = name?.split(' ');

    if (name.length <= 2) {
      return name;
    } else if (tokens.length === 2) {
      return tokens[0][0] + tokens[1][0];
    } else if (name.length === 3) {
      return name.slice(1, 3);
    }
    
    return tokens[0][0];
  }



}
