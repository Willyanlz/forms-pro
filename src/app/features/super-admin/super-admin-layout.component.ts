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
    menuItems = [
        { icon: 'dashboard', label: 'Dashboard', path: '/super-admin/dashboard' },
        { icon: 'users', label: 'Tenants', path: '/super-admin/tenants' },
        { icon: 'credit_card', label: 'Planos', path: '/super-admin/plans' },
        { icon: 'list_alt', label: 'Logs', path: '/super-admin/logs' },
        { icon: 'settings', label: 'Configurações', path: '/super-admin/settings' }
    ];

    sidebarOpen = true;

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }
}