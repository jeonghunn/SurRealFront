import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatLegacyTooltipDefaultOptions as MatTooltipDefaultOptions,
  MatLegacyTooltipModule as MatTooltipModule,
  MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS,
} from '@angular/material/legacy-tooltip';
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
