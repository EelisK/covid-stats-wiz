import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalComponent } from './global/global.component';
import { CountryComponent } from './country/country.component';
import { SigninComponent } from './signin/signin.component';
import { EditorComponent } from './editor/editor.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'admin/login', component: SigninComponent },
  { path: 'admin/news', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'countries/:countrySlug', component: CountryComponent },
  { path: 'countries', component: GlobalComponent },
  { path: '**', redirectTo: 'countries', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
