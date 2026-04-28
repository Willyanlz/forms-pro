import { Routes } from '@angular/router';
import { SuperAdminGuard } from './guards/super-admin.guard';

export const SUPER_ADMIN_ROUTES: Routes = [
    {
        path: '',
        canActivate: [SuperAdminGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'tenants',
                loadComponent: () => import('./tenants/tenants.component').then(m => m.TenantsComponent)
            },
            {
                path: 'tenants/:id',
                loadComponent: () => import('./tenant-detail/tenant-detail.component').then(m => m.TenantDetailComponent)
            },
            {
                path: 'plans',
                loadComponent: () => import('./plans/plans.component').then(m => m.PlansComponent)
            },
            {
                path: 'logs',
                loadComponent: () => import('./logs/logs.component').then(m => m.LogsComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
            }
        ]
    }
];