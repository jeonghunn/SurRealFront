import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  public constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  public onButtonClick(event: MouseEvent, isConfirm: boolean): void {
    this.dialogRef.close({
      option: isConfirm,
      data: this.dialogData?.returnValue,
    });
  }


}
