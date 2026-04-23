import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { I18nService } from '@core/services/i18n.service';
import { FormTemplate } from '@core/models';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <!-- Header -->
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/" class="text-text-secondary hover:text-text-primary">←</a>
            <h1 class="text-xl font-semibold text-text-primary" i18n="@@availableForms">
              Formulários Disponíveis
            </h1>
          </div>
        </div>
      </header>

      <!-- Forms Grid -->
      <div class="max-w-7xl mx-auto p-6">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (item of [1,2,3,4,5,6]; track item) {
              <div class="bg-white p-6 rounded-xl border border-border animate-pulse">
                <div class="h-6 bg-surface rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-surface rounded w-full mb-2"></div>
                <div class="h-4 bg-surface rounded w-2/3"></div>
              </div>
            }
          </div>
        } @else if (forms().length === 0) {
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2" i18n="@@noForms">
              Nenhum formulário disponível
            </h2>
            <p class="text-text-secondary" i18n="@@noFormsDesc">
              Em breve we'll have forms for you to fill out.
            </p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (form of forms(); track form.id) {
              <a
                [routerLink]="['/forms', form.slug]"
                class="bg-white p-6 rounded-xl border border-border hover:shadow-md hover:border-primary
                       transition-all group"
              >
                <div class="flex items-start justify-between mb-4">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    [class]="form.status === 'active' ? 'bg-success/10 text-success' : 'bg-surface text-text-secondary'"
                  >
                    {{ form.status === 'active' ? 'Ativo' : 'Rascunho' }}
                  </span>
                  <span class="text-2xl">📝</span>
                </div>
                <h3 class="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {{ getTitle(form) }}
                </h3>
                <p class="text-text-secondary text-sm mt-2 line-clamp-2">
                  {{ getDescription(form) }}
                </p>
                <div class="mt-4 flex items-center text-sm text-text-secondary">
                  <span>Clique para preencher →</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class FormListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private i18n = inject(I18nService);

  forms = signal<FormTemplate[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    await this.loadForms();
  }

  private async loadForms(): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('form_templates')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true });

      if (error) throw error;
      this.forms.set((data as FormTemplate[]) || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getTitle(form: FormTemplate): string {
    const lang = this.i18n.currentLang();
    return (form.title as any)?.[lang] || (form.title as any)?.['pt'] || 'Formulário';
  }

  getDescription(form: FormTemplate): string {
    const lang = this.i18n.currentLang();
    return (form.description as any)?.[lang] || (form.description as any)?.['pt'] || '';
  }
}
