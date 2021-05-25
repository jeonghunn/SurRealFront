import {
  Component,
  Input,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: [ './error-page.component.scss' ],
})
export class ErrorPageComponent {

  @Input()
  public errorCode: number = 404;

  private subscriptions: Subscription[] = [];

  public constructor(
    private dataService: DataService,
    private router: Router,
  ) {
    this.subscriptions.push(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((s: NavigationEnd) => {
          this.cancel();
        }),
    );
  }

  public cancel(): void {
    this.dataService.cancelHttpError();
  }

  public refresh(): void {
    window.location.reload();
  }

  public feedback(): void {
    window.location.href = 'mailto:jeonghunn1@gmail.com';
  }

  public goBack(): void {
    window.history.back();
  }

}
