import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { AboutComponent } from './about/about.component';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { SettingComponent } from './setting/setting.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    AboutComponent,
    SettingComponent,
    IntroPageComponent,
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatListModule,
    MatIconModule,
  ],
})
export class PageModule { }
