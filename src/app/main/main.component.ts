import {
  Component,
  OnInit,
} from '@angular/core';
import { IdentityService } from 'src/app/core/identity.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ],
})
export class MainComponent implements OnInit {

  public isGuest: boolean = true;

  public constructor(
    private identityService: IdentityService,
  ) {
    if (identityService.getAuth()) {
      this.isGuest = false;
    }
  }

  public ngOnInit(): void {
  }

  public onRegister(): void {
    this.isGuest = false;
  }

}
