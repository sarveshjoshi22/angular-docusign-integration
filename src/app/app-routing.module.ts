import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetstateComponent } from './setstate/setstate.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'sendEmail', component: AppComponent },
  { path: 'setState', component: SetstateComponent },
  { path: '', component: AppComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
