import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { Guard } from './core/guard/guard';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './page/about/about.component';
import { GroupCreateComponent } from './page/group/group-create/group-create.component';
import { GroupComponent } from './page/group/group.component';
import { LandingComponent } from './page/landing/landing.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';
import { SettingComponent } from './page/setting/setting.component';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { SignUpComponent } from './page/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ Guard ],
  },
  {
    path: 'group',
    canActivate: [ Guard ],
    children: [
      { path: 'create', component: GroupCreateComponent },
      { path: ':id', component: GroupComponent },
      { path: ':id/room/:room_id', component: GroupComponent },
    ],
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [ Guard ],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [ Guard ],
  },
  {
    path: 'user/:id',
    component: ProfilePageComponent,
    canActivate: [ Guard ],
  },
  { path: 'intro', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ],
})

export class AppRoutingModule { }
