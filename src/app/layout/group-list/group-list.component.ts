import {
  Component, EventEmitter,
  OnInit, Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ],
})
export class GroupListComponent implements OnInit {

  @Output()
  public readonly toggleSidNav: EventEmitter<null> = new EventEmitter();

  public constructor(
    private router: Router,
  ) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit(): void {
  }

  public go(url: string): void {
    this.router.navigateByUrl(url).then(r => {
      this.toggleSidNav.emit();
    });
  }

}
