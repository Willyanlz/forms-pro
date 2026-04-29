import { Routes } from '@angular/router';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./features/forms/form-list/form-list.component').then(
        (m) => m.FormListComponent
      ),
  },
  {
    path: 'forms/:slug',
    loadComponent: () =>
      import('./features/forms/form-view/form-view.component').then(
        (m) => m.FormViewComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/forms/form-view/form-view.component').then(
        (m) => m.FormViewComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'first-access',
    loadComponent: () =>
      import('./features/auth/first-access/first-access.component').then(
        (m) => m.FirstAccessComponent
      ),
  },
  {
    path: 'set-password',
    loadComponent: () =>
      import('./features/auth/set-password/set-password.component').then(
        (m) => m.SetPasswordComponent
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./features/super-admin/super-admin.routes').then((m) => m.SUPER_ADMIN_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
