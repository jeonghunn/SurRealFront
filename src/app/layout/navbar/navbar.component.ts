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
export class NavbarComponent {

  public constructor(
    public dialog: MatDialog,
    private identityService: IdentityService,
    private router: Router,
  ) { }

  public get isSignedIn(): boolean {
    return this.identityService.isSignedIn;
  }

  public get userName(): string {
    return this.identityService.firstName;
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
  }

  public goAbout(): void {
    this.router.navigateByUrl('about').then(null);
  }

  public goSignIn(): void {
    this.router.navigateByUrl('signin').then(null);
  }

  public goSignUp(): void {
    this.router.navigateByUrl('signup').then(null);
  }

}
