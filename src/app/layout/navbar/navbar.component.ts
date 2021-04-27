import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IdentityService } from 'src/app/core/identity.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
})
export class NavbarComponent implements OnInit {

  public constructor(
    public dialog: MatDialog,
    private identityService: IdentityService,
    private router: Router,
  ) { }

  public get isSignedIn(): boolean {
    return this.identityService.isSignedIn;
  }

  public goSignIn(): void {
    this.router.navigateByUrl('signin').then(null);
  }

  public goSignUp(): void {
    this.router.navigateByUrl('signup').then(null);
  }

  public ngOnInit(): void {
  }
}
