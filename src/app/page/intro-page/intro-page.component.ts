import { Component } from '@angular/core';

@Component({
    selector: 'app-intro-page',
    templateUrl: './intro-page.component.html',
    styleUrls: ['./intro-page.component.scss'],
    standalone: false
})
export class IntroPageComponent {

  public isCustomServer: boolean = false;
  public isHidePassword: boolean = true;

}
