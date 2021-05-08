import {
  Component,
  OnInit,
} from '@angular/core';
import { version } from 'package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: [ './about.component.scss' ],
})
export class AboutComponent implements OnInit {

  public appVersion: string = '0.0.0';

  // tslint:disable-next-line:no-empty
  public constructor() { }

  public ngOnInit(): void {
    this.appVersion = version;
  }

}
