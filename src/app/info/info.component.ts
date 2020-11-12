import {
  Component,
  OnInit,
} from '@angular/core';
import { version } from 'package.json';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: [ './info.component.scss' ],
})
export class InfoComponent implements OnInit {

  public appVersion: string = '0.0.0';

  public constructor(
    private dataService: DataService,
    // tslint:disable-next-line:no-empty
  ) {

  }

  public ngOnInit(): void {
    this.appVersion = version;
  }

}
