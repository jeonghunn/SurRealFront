import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { UiModule } from 'src/ui/ui.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FriendButtonComponent } from './friend-button/friend-button.component';
import { FriendMenuComponent } from './friend-button/friend-menu/friend-menu.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { RoomCreateComponent } from './room/room-create/room-create.component';
import { RoomItemComponent } from './room/room-list/room-item/room-item.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { ProfileIconComponent } from './ui/profile-icon/profile-icon.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SkeletonLoaderComponent } from './ui/skeleton-loader/skeleton-loader.component';

@NgModule({
  declarations: [
    FooterComponent,
    ErrorPageComponent,
    ProfileIconComponent,
    FriendButtonComponent,
    FriendListComponent,
    UserProfileComponent,
    FriendMenuComponent,
    RoomListComponent,
    RoomItemComponent,
    RoomCreateComponent,
    SkeletonLoaderComponent,
  ],
    exports: [
        FooterComponent,
        ErrorPageComponent,
        ProfileIconComponent,
        FriendButtonComponent,
        FriendListComponent,
        RoomListComponent,
        SkeletonLoaderComponent,
    ],
  imports: [
    UiModule,
    TranslateModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    CommonModule,
    MatRippleModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
})
export class ComponentsModule { }
