import { Routes } from '@angular/router';
import { HomeComponent, ComplaintsComponent, NoticesComponent, InfoComponent } from './pages';
import { AdminLoginComponent, AdminComponent } from './admin';
import { adminGuard } from './auth';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'notices', component: NoticesComponent },
  ...['schemes', 'utilities', 'farmer', 'transparency', 'contact'].map(k => ({ path: k, component: InfoComponent, data: { key: k } })),
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
