import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import {
  catchError,
  take,
} from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: [ './room-create.component.scss' ],
})
export class RoomCreateComponent implements OnInit {

  @Input()
  public groupId: number;

  @Output()
  public readonly save: EventEmitter<null> = new EventEmitter();

  public isShowAdvanced: boolean = false;
  public isLoading: boolean = false;

  public form: FormGroup;

  public constructor(
    private translateService: TranslateService,
    private matSnakeBar: MatSnackBar,
    public dialogRef: MatDialogRef<RoomCreateComponent>,
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
  }

  public ngOnInit(): void {
    if (this.dialogData) {
      this.groupId = this.dialogData.groupId;
    }

    this.form = new FormGroup({
      name: new FormControl(),
    });
  }

  public close(event: Event): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  public submit(event: Event): void {
    event.preventDefault();

    this.isLoading = true;
    console.log(this.form.value);
    this.dataService.createRoom(this.groupId, this.form.value).pipe(
      take(1),
      catchError(error => {
        this.isLoading = false;
        this.matSnakeBar.open(this.translateService.instant('ERROR.UNKNOWN'));

        return throwError(error);
      }),
      ).subscribe((result) => {
        this.dialogRef.close();
        this.isLoading = false;
        this.save.emit();
      });
  }

}
