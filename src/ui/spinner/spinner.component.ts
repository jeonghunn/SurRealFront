import {
  Component,
  Input,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    imports: [ MatProgressSpinnerModule ],
    standalone: true,
})
export class SpinnerComponent {

  @Input()
  public diameter: number = 32;

}
