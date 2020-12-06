import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: [ './match-modal.component.scss' ],
})
export class MatchModalComponent implements OnInit {

  public constructor(
    public dialogRef: MatDialogRef<MatchModalComponent>,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

}
