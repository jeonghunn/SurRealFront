import {
  Component,
} from '@angular/core';
import * as packageInfo from 'package.json';
import { IdentityService } from 'src/app/core/identity.service';
import { LayoutService } from 'src/app/core/layout.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ],
})
export class MainComponent {

  public isGuest: boolean = true;
  public readonly version: string = '2023 July Update: Patch 2';

  public constructor(
    private identityService: IdentityService,
    private layoutService: LayoutService,
  ) {
    if (identityService.isSignedIn) {
      this.isGuest = false;
    }

    layoutService.isSideNavOpen = true;

  }

  public openDiscordServer(): void {
    location.href = 'https://discord.gg/ucpW3hChb7';
  }

  public onRegister(): void {
    this.isGuest = false;
  }

}
