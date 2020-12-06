import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/core/data.service';
import {
  Gender,
  ResponseResult,
} from 'src/app/model/type';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: [ './match-modal.component.scss' ],
})
export class MatchModalComponent implements OnInit {

  public isMatching: boolean = false;
  public isLoading: boolean = false;
  public targetGender: Gender = Gender.ALL;
  public firstMessage: string = null;

  public constructor(
    public dialogRef: MatDialogRef<MatchModalComponent>,
    public cookieService: CookieService,
    private dataService: DataService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  public ngOnInit(): void {
    this.firstMessage = this.cookieService.get('first_message');
  }

  public onCancelClick(): void {
    this.saveFirstMessage();
    this.dialogRef.close();
  }

  public saveFirstMessage(): void {
    this.cookieService.set('first_message', this.firstMessage);
  }

  public startMatchMaking(): void {
    this.dataService.requestMatch(this.targetGender, this.firstMessage).subscribe(response => {
      if (response.category === ResponseResult.SUCCESS) {
        this.isMatching = true;
        this.onCancelClick();
      } else {
        this.matSnackBar.open(this.translateService.instant('ERROR.UNKNOWN'));
      }
    });
  }

}
