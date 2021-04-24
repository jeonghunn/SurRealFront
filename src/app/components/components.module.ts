import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { UiModule } from 'src/ui/ui.module';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    FooterComponent,
    ErrorPageComponent,

  ],
  exports: [
    FooterComponent,
    ErrorPageComponent,
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
  ],
})
export class ComponentsModule { }
