import {
  Component,
  Output,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/core/data.service';
import { IdentityService } from 'src/app/core/identity.service';
import { Gender } from 'src/app/model/type';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: [ './intro.component.scss' ],
})
export class IntroComponent {

  @Output()
  public readonly registered: EventEmitter<null> = new EventEmitter<null>();

  public gender: Gender;
  public isRequesting: boolean = false;

  public constructor(
    private dataService: DataService,
    private identityService: IdentityService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  public onStartClick(): void {
    if (!this.gender) {
      this.matSnackBar.open(this.translateService.instant('INTRODUCTION.SELECT_GENDER_DESC'));
      return;
    }

    this.dataService.requestSignUp(this.gender).subscribe(userSet => {
      if (userSet.auth) {
        this.identityService.setAuth(userSet.auth);
        this.registered.emit();
      } else {
        this.matSnackBar.open(this.translateService.instant('ERROR.UNKNOWN'));
      }
    });
  }

}
