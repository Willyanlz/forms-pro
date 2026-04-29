import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SuperAdminService } from '../super-admin.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent implements OnInit {
  tenantId!: string;
  tenant: any = null;
  forms: any[] = [];
  submissions: any[] = [];
  loading = true;
  activeTab = 'overview';

  constructor(
    private route: ActivatedRoute,
    private superAdminService: SuperAdminService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.tenantId = params['id'];
        this.loading = true;
        return this.superAdminService.getTenantById(this.tenantId);
      })
    ).subscribe({
      next: (result: any) => {
        this.tenant = result.data;
        this.loadTenantData();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadTenantData(): void {
    this.superAdminService.getTenantForms(this.tenantId).subscribe({
      next: (result: any) => {
        this.forms = result.data || [];
      }
    });

    this.superAdminService.getTenantSubmissions(this.tenantId).subscribe({
      next: (result: any) => {
        this.submissions = result.data || [];
        this.loading = false;
      }
    });
  }

  toggleBlock(): void {
    if (confirm(`Tem certeza que deseja ${this.tenant.blocked ? 'desbloquear' : 'bloquear'} este tenant?`)) {
      this.superAdminService.toggleTenantBlock(this.tenantId, !this.tenant.blocked).subscribe({
        next: () => {
          this.tenant.blocked = !this.tenant.blocked;
        }
      });
    }
  }

  impersonate(): void {
    if (confirm('Tem certeza que deseja logar como este usuário? Você irá perder sua sessão atual.')) {
      this.superAdminService.generateImpersonateToken(this.tenantId).subscribe({
        next: (result: any) => {
          if (result.data) {
            localStorage.setItem('sb-access-token', result.data.access_token);
            localStorage.setItem('sb-refresh-token', result.data.refresh_token);
            window.location.href = '/dashboard';
          }
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
