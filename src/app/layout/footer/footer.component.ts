import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.scss' ],
})
export class FooterComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  public constructor(
    private router: Router,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }

}
