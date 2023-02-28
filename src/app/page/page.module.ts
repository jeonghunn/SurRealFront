import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
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
