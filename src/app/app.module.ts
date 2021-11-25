import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatRippleModule,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AuthInterceptor } from './core/auth.intercepter';
import { Guard } from './core/guard/guard';
import { LayoutModule } from './layout/layout.module';
import { MainComponent } from './main/main.component';
import { PageModule } from './page/page.module';

const HttpLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http);
};

const globalRippleConfig: RippleGlobalOptions = {
  disabled: false,
  animation: {
    enterDuration: 150,
    exitDuration: 0,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    PageModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatSidenavModule,
    MatSnackBarModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ],
      },
    }),
    FormsModule,
    LayoutModule,
    MatRippleModule,
  ],
  providers: [
    Guard,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 },
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: globalRippleConfig,
    },
  ],
  bootstrap: [ AppComponent ],
})

export class AppModule { }
