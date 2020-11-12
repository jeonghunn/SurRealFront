import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
})
export class NavbarComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  public constructor(
    private router: Router,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }

}
