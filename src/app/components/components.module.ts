import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from 'src/ui/ui.module';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    Error404Component,
    Error500Component,

  ],
  exports: [
    NavbarComponent,
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
  ],
})
export class ComponentsModule { }
