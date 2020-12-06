import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatchModalComponent } from 'src/app/match-modal/match-modal/match-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
})
export class NavbarComponent implements OnInit {

  public constructor(
    public dialog: MatDialog,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(MatchModalComponent, {
      maxWidth: '400px',
      minWidth: '280px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
