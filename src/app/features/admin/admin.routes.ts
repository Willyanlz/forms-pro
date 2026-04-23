import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'form-builder',
    loadComponent: () =>
      import('./form-builder/form-builder-list/form-builder-list.component').then(
        (m) => m.FormBuilderListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'form-builder/:id',
    loadComponent: () =>
      import('./form-builder/form-builder-editor/form-builder-editor.component').then(
        (m) => m.FormBuilderEditorComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'submissions',
    loadComponent: () =>
      import('./submissions/submissions-list/submissions-list.component').then(
        (m) => m.SubmissionsListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'submissions/:id',
    loadComponent: () =>
      import('./submissions/submission-detail/submission-detail.component').then(
        (m) => m.SubmissionDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings/appearance',
    loadComponent: () =>
      import('./settings/appearance/appearance.component').then((m) => m.AppearanceComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings/email',
    loadComponent: () =>
      import('./settings/email/email.component').then((m) => m.EmailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings/whatsapp',
    loadComponent: () =>
      import('./settings/whatsapp/whatsapp.component').then((m) => m.WhatsappComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings/general',
    loadComponent: () =>
      import('./settings/general/general.component').then((m) => m.GeneralComponent),
    canActivate: [authGuard],
  },
];