import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MissingComponent} from './missing/missing.component';
import {UserComponent} from './user/user.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {path: '', redirectTo: '/debug', pathMatch: 'full'},
  {path: 'debug', component: HomeComponent},
  {path: 'user/:id', component: UserComponent},
  {path: '**', component: MissingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
