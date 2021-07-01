import {
  Component, EventEmitter,
  OnInit, Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';
import { Group } from 'src/app/model/type';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ],
})
export class GroupListComponent implements OnInit {

  @Output()
  public readonly toggleSidNav: EventEmitter<null> = new EventEmitter();

  public groups: Group[] = [];

  public constructor(
    private router: Router,
    private dataService: DataService,
  ) { }

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    this.dataService.getGroupList().pipe(take(1)).subscribe((groups: Group[]) => {
      this.groups = groups;
    });
  }

  public go(url: string): void {
    this.router.navigateByUrl(url).then(r => {
      this.toggleSidNav.emit();
    });
  }

  public onGroupClick(id: number): void {
    this.router.navigateByUrl(`/group/${id}`);
  }

}
