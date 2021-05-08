import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BigerrorComponent } from './bigerror/bigerror.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    BigerrorComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    BigerrorComponent,
    SpinnerComponent,
  ],
})
export class UiModule { }
