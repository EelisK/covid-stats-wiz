import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalComponent } from './global/global.component';
import { CountryComponent } from './country/country.component';

export const routes: Routes = [
  { path: 'countries/:countrySlug', component: CountryComponent },
  { path: 'countries', component: GlobalComponent },
  { path: '', redirectTo: 'countries', pathMatch: 'full' },
  // { path: 'admin/login' },
  // { path: 'admin' },
  // { path: '**' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
