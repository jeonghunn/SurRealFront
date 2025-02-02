import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BigerrorComponent } from './bigerror/bigerror.component';

@NgModule({
  declarations: [
    BigerrorComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    BigerrorComponent,
  ],
})
export class UiModule { }
