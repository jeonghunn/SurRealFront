import {
  Component,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IdentityService } from 'src/app/core/identity.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    standalone: true,
    imports: [ MatButtonModule ],
})
export class LandingComponent {

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
