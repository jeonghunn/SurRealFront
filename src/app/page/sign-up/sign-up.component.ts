import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.scss' ],
})
export class SignUpComponent {

  public isHidePassword: boolean = true;

  public signUpForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8)),
    name: new FormControl(''),
  });
}
