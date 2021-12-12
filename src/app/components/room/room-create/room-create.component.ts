import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: [ './room-create.component.scss' ],
})
export class RoomCreateComponent {

  public isShowAdvanced: boolean = false;

  public constructor(
    public dialogRef: MatDialogRef<RoomCreateComponent>,
  ) {
  }

}
