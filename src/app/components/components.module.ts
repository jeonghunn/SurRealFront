import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { UiModule } from 'src/ui/ui.module';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';

@NgModule({
  declarations: [
    FooterComponent,
    Error404Component,
    Error500Component,

  ],
  exports: [
    FooterComponent,
    Error404Component,
    Error500Component,
  ],
  imports: [
    UiModule,
    TranslateModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
  ],
})
export class ComponentsModule { }
