import {
  Component,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
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
  public returnPath: string = '/';

  public signInForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
    password: new UntypedFormControl('', Validators.minLength(8)),
  });

  public constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private identityService: IdentityService,
    public router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.returnPath = this.activatedRoute.snapshot.queryParams?.return || '/';

    if (this.identityService.isSignedIn) {
      this.router.navigateByUrl(this.returnPath).then(null);
    }
  }

  public onHidePasswordClick(event: MouseEvent): void {
    event.preventDefault();
    this.isHidePassword = !this.isHidePassword;
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
  }

  public onSubmit(event: Event): void {
    event.stopPropagation();

    this.isLoading = true;
    this.isHidePassword = true;

    this.identityService.signIn(this.signInForm).pipe(
      catchError(error => {
        this.isLoading = false;

        if (error.status === 403) {
          this.hasAuthError = true;
        }

        return throwError(error);
      }),
    ).subscribe((result: UserSimpleSet) => {
      this.isLoading = false;
      this.router.navigateByUrl(this.returnPath).then(null);
    });

  }

}
