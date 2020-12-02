import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from 'src/ui/ui.module';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { FooterComponent } from './footer/footer.component';
import { ContainerLayoutComponent } from './layout/container-layout/container-layout.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    Error404Component,
    Error500Component,
    ContainerLayoutComponent,

  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    Error404Component,
    Error500Component,
    ContainerLayoutComponent,
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
