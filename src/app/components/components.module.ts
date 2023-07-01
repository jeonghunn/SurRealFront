import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
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
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ThumbnailComponent } from './ui/thumbnail/thumbnail.component';
import { ViewerComponent } from './viewer/viewer.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { ConfirmComponent } from './confirm/confirm.component';

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
    ThumbnailComponent,
    ViewerComponent,
    ConfirmComponent,
  ],
    exports: [
        FooterComponent,
        ErrorPageComponent,
        ProfileIconComponent,
        FriendButtonComponent,
        FriendListComponent,
        RoomListComponent,
        SkeletonLoaderComponent,
        ThumbnailComponent,
        ViewerComponent,
        ConfirmComponent,
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
    PickerComponent,
    EmojiPickerComponent,
    NgxFilesizeModule,
  ],
})
export class ComponentsModule { }
