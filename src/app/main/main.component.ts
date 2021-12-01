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
export class MainComponent {

  public isGuest: boolean = true;

  public constructor(
    private identityService: IdentityService,
  ) {
    if (identityService.isSignedIn) {
      this.isGuest = false;
    }
  }

  public openDiscordServer(): void {
    location.href = 'https://discord.gg/ucpW3hChb7';
  }

  public onRegister(): void {
    this.isGuest = false;
  }

}
