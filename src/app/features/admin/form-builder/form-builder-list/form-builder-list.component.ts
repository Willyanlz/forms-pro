import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { I18nService } from '@core/services/i18n.service';
import { FormTemplate } from '@core/models';

@Component({
  selector: 'app-form-builder-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
            <div>
              <h1 class="text-xl font-semibold text-text-primary" i18n="@@formBuilder">Construtor de Formulários</h1>
              <p class="text-sm text-text-secondary" i18n="@@formBuilderDesc">Gerencie seus formulários</p>
            </div>
          </div>
          <a
            routerLink="/admin/form-builder/new"
            class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            i18n="@@newForm"
          >
            + Novo Formulário
          </a>
        </div>
      </header>

      <div class="max-w-7xl mx-auto p-6">
        @if (loading()) {
          <div class="bg-white rounded-xl border border-border">
            @for (item of [1,2,3]; track item) {
              <div class="px-6 py-4 border-b border-border animate-pulse">
                <div class="h-5 bg-surface rounded w-1/3 mb-2"></div>
                <div class="h-4 bg-surface rounded w-1/4"></div>
              </div>
            }
          </div>
        } @else if (forms().length === 0) {
          <div class="text-center py-12 bg-white rounded-xl border border-border">
            <div class="text-6xl mb-4">📝</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2" i18n="@@noFormsYet">
              Nenhum formulário ainda
            </h2>
            <p class="text-text-secondary mb-4" i18n="@@createFirstForm">
              Crie seu primeiro formulário para começar a receber respostas.
            </p>
            <a
              routerLink="/admin/form-builder/new"
              class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
              i18n="@@createForm"
            >
              Criar Formulário
            </a>
          </div>
        } @else {
          <div class="bg-white rounded-xl border border-border overflow-hidden">
            <table class="w-full">
              <thead class="bg-surface">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@title">Título</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@status">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@sections">Seções</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@responses">Respostas</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@created">Criado em</th>
                  <th class="px-6 py-3 text-right text-sm font-medium text-text-secondary" i18n="@@actions">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @for (form of forms(); track form.id) {
                  <tr class="hover:bg-surface">
                    <td class="px-6 py-4">
                      <a
                        [routerLink]="['/admin/form-builder', form.id]"
                        class="font-medium text-text-primary hover:text-primary"
                      >
                        {{ getTitle(form) }}
                      </a>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs rounded-full"
                        [class]="form.status === 'active' ? 'bg-success/10 text-success' : 
                                 form.status === 'draft' ? 'bg-warning/10 text-warning' : 'bg-surface text-text-secondary'"
                      >
                        {{ getStatusLabel(form.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-text-secondary">-</td>
                    <td class="px-6 py-4 text-text-secondary">-</td>
                    <td class="px-6 py-4 text-text-secondary text-sm">
                      {{ formatDate(form.created_at) }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex gap-2 justify-end">
                        <a
                          [routerLink]="['/admin/form-builder', form.id]"
                          class="p-2 text-text-secondary hover:text-primary transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </a>
                        <button
                          (click)="duplicateForm(form)"
                          class="p-2 text-text-secondary hover:text-primary transition-colors"
                          title="Duplicar"
                        >
                          📋
                        </button>
                        <button
                          (click)="archiveForm(form)"
                          class="p-2 text-text-secondary hover:text-error transition-colors"
                          title="Arquivar"
                        >
                          🗄️
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class FormBuilderListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private i18n = inject(I18nService);

  forms = signal<FormTemplate[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data } = await this.supabase.client
      .from('form_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    this.forms.set((data as FormTemplate[]) || []);
    this.loading.set(false);
  }

  getTitle(form: FormTemplate): string {
    const lang = this.i18n.currentLang();
    return (form.title as any)?.[lang] || (form.title as any)?.['pt'] || 'Sem título';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Ativo',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  async duplicateForm(form: FormTemplate): Promise<void> {
    // TODO: Implement duplicate
  }

  async archiveForm(form: FormTemplate): Promise<void> {
    // TODO: Implement archive
  }
}