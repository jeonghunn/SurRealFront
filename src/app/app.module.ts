import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
