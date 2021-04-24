import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { BigerrorComponent } from './bigerror/bigerror.component';

@NgModule({
  declarations: [ BigerrorComponent ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
  ],
  exports: [
    BigerrorComponent,
  ],
})
export class UiModule { }
