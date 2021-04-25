import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
})
export class NavbarComponent implements OnInit {

  public constructor(
    public dialog: MatDialog,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }
}
