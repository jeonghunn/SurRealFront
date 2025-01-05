import {
  Component,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  catchError,
  take,
} from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import { UserSimpleSet } from 'src/app/model/type';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false
})
export class SignUpComponent implements OnInit {

  public isHidePassword: boolean = true;
  public isLoading: boolean = false;
  public returnPath: string = '/';

  public signUpForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
    password: new UntypedFormControl('', Validators.minLength(8)),
    name: new UntypedFormControl(''),
  });

  public constructor(
    private dataService: DataService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.returnPath = this.activatedRoute.snapshot.queryParams?.return || '/';

    if (this.identityService.isSignedIn) {
      this.router.navigateByUrl(this.returnPath).then(null);
    }
  }

  public goMain(): void {
    this.router.navigateByUrl('/').then(null);
  }

  public onSubmit(event: MouseEvent): void {

    this.isLoading = true;
    this.dataService.signUp(this.signUpForm.value)
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          if (error.status === 409) {
            this.matSnackBar.open(this.translateService.instant('SIGN_UP.DUPLICATED'));
          }

          return error;
        }),
        )
      .subscribe((result: UserSimpleSet) => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnPath).then(null);
      });
  }

  public onClickPasswordHide(event: MouseEvent): void {
    event.preventDefault();
    this.isHidePassword = !this.isHidePassword;
  }
}
