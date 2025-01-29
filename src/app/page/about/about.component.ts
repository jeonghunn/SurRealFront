import {
  Component,
  OnInit,
} from '@angular/core';
import packageInfo from 'package.json';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent implements OnInit {

  public appVersion: string = '0.0.0';

  // tslint:disable-next-line:no-empty
  public constructor() { }

  public ngOnInit(): void {
    this.appVersion = packageInfo.version;
  }

}
