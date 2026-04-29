import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-super-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './super-admin-layout.component.html',
    styleUrls: ['./super-admin-layout.component.scss']
})
export class SuperAdminLayoutComponent {
    navigation = [
        { label: 'Dashboard', path: '/super-admin/dashboard' },
        { label: 'Tenants', path: '/super-admin/tenants' },
        { label: 'Planos', path: '/super-admin/plans' },
        { label: 'Logs', path: '/super-admin/logs' },
        { label: 'Configurações', path: '/super-admin/settings' }
    ];
}
