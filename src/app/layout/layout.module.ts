import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { GroupListComponent } from './group-list/group-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OneContainerComponent } from './one-container/one-container.component';

@NgModule({
  declarations: [
    GroupListComponent,
    NavbarComponent,
    OneContainerComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatRippleModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    TranslateModule,
    MatMenuModule,
    ComponentsModule,
  ],
  exports: [
    GroupListComponent,
    NavbarComponent,
    OneContainerComponent,
  ],
})
export class LayoutModule { }
