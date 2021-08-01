import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import {
  catchError,
  take,
} from 'rxjs/operators';
import { DataService } from '../../core/data.service';
import { IdentityService } from '../../core/identity.service';
import { UserSimpleSet } from '../../model/type';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [ './sign-in.component.scss' ],
})
export class SignInComponent implements OnInit {

  public isHidePassword: boolean = true;
  public isLoading: boolean = false;
  public hasAuthError: boolean = false;

  public signInForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8)),
  });

  public constructor(
    private dataService: DataService,
    private identityService: IdentityService,
    public router: Router,
  ) {
  }

  public ngOnInit(): void {
    if (this.identityService.isSignedIn) {
      this.goMain();
    }
  }

  public onHidePasswordClick(event: MouseEvent): void {
    event.preventDefault();
    this.isHidePassword = !this.isHidePassword;
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
  }

  public onSubmit(): void {
    this.isLoading = true;
    this.dataService.signIn(this.signInForm.value)
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;

          if (error.status === 403) {
            this.hasAuthError = true;
          }

          return throwError(error);
        }),
      )
      .subscribe((result: UserSimpleSet) => {
        this.isLoading = false;
        this.goMain();
      });
  }

}
