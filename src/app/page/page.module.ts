import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LayoutModule } from 'src/app/layout/layout.module';
import { UiModule } from 'src/ui/ui.module';
import { ComponentsModule } from '../components/components.module';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './group/chat/chat.component';
import { MessageComponent } from './group/chat/message/message.component';
import { DetailViewComponent } from './group/detail-view/detail-view.component';
import { GroupCreateComponent } from './group/group-create/group-create.component';
import { GroupComponent } from './group/group.component';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { LandingComponent } from './landing/landing.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SettingComponent } from './setting/setting.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RoomComponent } from './group/room/room.component';
import { GroupInfoComponent } from './group/group-info/group-info.component';
import { MapComponent } from './group/detail-view/map/map.component';

@NgModule({
  declarations: [
    AboutComponent,
    SettingComponent,
    IntroPageComponent,
    SignInComponent,
    SignUpComponent,
    LandingComponent,
    GroupCreateComponent,
    ProfilePageComponent,
    GroupComponent,
    ChatComponent,
    DetailViewComponent,
    MessageComponent,
    RoomComponent,
    GroupInfoComponent,
    MapComponent,
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
        MatTabsModule,
        TranslateModule,
        MatListModule,
        MatIconModule,
        ReactiveFormsModule,
        UiModule,
        MatCardModule,
        ComponentsModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        MatRippleModule,
        MatChipsModule,
    ],
})
export class PageModule { }
