import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatTooltipDefaultOptions,
  MatTooltipModule,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
} from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { GroupListComponent } from '../components/group-list/group-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OneContainerComponent } from './one-container/one-container.component';

export const matTooltipCustomConfig: MatTooltipDefaultOptions = {
  showDelay: 5,
  hideDelay: 5,
  touchendHideDelay: 5,
  touchGestures: 'off',
};

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
    MatTooltipModule,
  ],
  exports: [
    GroupListComponent,
    NavbarComponent,
    OneContainerComponent,
  ],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: matTooltipCustomConfig },
  ],
})
export class LayoutModule { }
