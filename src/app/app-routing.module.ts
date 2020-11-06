import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  // { path: 'countries/:countrySlug' },
  { path: 'countries', component: SummaryComponent },
  // { path: '', redirectTo: 'summary', pathMatch: 'full' },
  // { path: 'admin/login' },
  // { path: 'admin' },
  // { path: '**' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
