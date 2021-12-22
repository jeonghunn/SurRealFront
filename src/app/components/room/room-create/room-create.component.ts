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
import { take } from 'rxjs/operators';
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

  public close(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.isLoading = true;
    console.log(this.form.value);
    this.dataService.createRoom(this.groupId, this.form.value).pipe(take(1)).subscribe((result) => {
      this.dialogRef.close();
      this.isLoading = false;
      this.save.emit();
    });
  }

}
