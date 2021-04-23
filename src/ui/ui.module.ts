import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BigerrorComponent } from './bigerror/bigerror.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';

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
