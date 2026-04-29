import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SuperAdminService } from '../super-admin.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-tenants',
  imports: [CommonModule, RouterModule, TableModule, FormsModule, DialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
})
export class TenantsComponent implements OnInit {

  tenants: any[] = [];
  loading = true;
  showCreateModal = signal(false);
  creating = signal(false);

  // Formulario
  formEmail = '';
  formPassword = '';
  formName = '';
  formCompany = '';
  formPhone = '';

  constructor(
    private superAdminService: SuperAdminService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.superAdminService.getAllTenants().subscribe({
      next: (result: any) => {
        console.log('✅ RESPOSTA DO BACKEND:', result);

        // Suporta QUALQUER formato que vier
        if (Array.isArray(result)) {
          this.tenants = result;
        } else if (result?.data) {
          this.tenants = result.data;
        } else {
          this.tenants = [];
        }

        console.log('✅ TENANTS FINAL:', this.tenants);

        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        console.log('✅ LOADING DESATIVADO:', this.loading);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.tenants = [];
      }
    });
  }

  formatDate(date: string) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openCreateModal() {
    this.formEmail = '';
    this.formPassword = '';
    this.formName = '';
    this.formCompany = '';
    this.formPhone = '';
    this.showCreateModal.set(true);
  }

  async onCreateTenant() {
    if (!this.formEmail || !this.formPassword || !this.formName) {
      this.toast.error('Preencha pelo menos email, senha e nome');
      return;
    }

    this.creating.set(true);

    try {
      await this.superAdminService.createTenant(
        this.formEmail,
        this.formPassword,
        this.formName,
        this.formCompany,
        this.formPhone
      ).toPromise();

      this.toast.success('Assinante criado com sucesso! Ele receberá uma senha temporária e será obrigado a trocar no primeiro acesso.');

      this.showCreateModal.set(false);
      this.loadTenants();

    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao criar assinante');
    } finally {
      this.creating.set(false);
    }
  }
}
