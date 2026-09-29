import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminComponent },
      // ide jönnek majd a további oldalak, pl.:
      // { path: 'termekek', component: TermekekComponent },
      // { path: 'kapcsolat', component: KapcsolatComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];