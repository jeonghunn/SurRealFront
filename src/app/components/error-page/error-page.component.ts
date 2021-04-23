import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: [ './error-page.component.scss' ],
})
export class ErrorPageComponent {

  @Input()
  public errorCode: number = 404;

  public refresh(): void {
    window.location.reload();
  }

  public feedback(): void {
    window.location.href = 'mailto:jeonghunn1@gmail.com';
  }

}
