import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { I18nService } from '@core/services/i18n.service';
import { ToastService } from '@core/services/toast.service';
import { AppSettings, createDefaultAppSettings } from '@core/models';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center gap-4">
          <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
          <div>
            <h1 class="text-xl font-semibold text-text-primary" i18n="@@generalSettings">Geral</h1>
            <p class="text-sm text-text-secondary" i18n="@@generalSettingsDesc">Configurações gerais do sistema</p>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-6">
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-border p-6">
          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@defaultLanguage">
              Idioma Padrão
            </label>
            <select
              [(ngModel)]="settings.default_language"
              name="default_language"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors bg-white"
            >
              <option value="pt">Português (Brasil)</option>
              <option value="en">English (US)</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@activeLanguages">
              Idiomas Ativos
            </label>
            <div class="space-y-2">
              @for (lang of languages; track lang.code) {
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="isLanguageActive(lang.code)"
                    (change)="toggleLanguage(lang.code)"
                    class="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span class="text-text-primary">{{ lang.label }}</span>
                </label>
              }
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@webhookUrl">
              Webhook URL (opcional)
            </label>
            <input
              type="url"
              [(ngModel)]="settings.webhook_url"
              name="webhook_url"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors"
              placeholder="https://seu-site.com/api/webhook"
            />
            <p class="text-xs text-text-secondary mt-1">
              URL que será chamada quando uma nova submissão for recebida
            </p>
          </div>

          <button
            type="submit"
            [disabled]="saving()"
            class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark
                   transition-colors disabled:opacity-50"
          >
            {{ saving() ? 'Salvando...' : 'Salvar' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class GeneralComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  settings: AppSettings = createDefaultAppSettings();

  activeLanguages: string[] = ['pt'];
  saving = signal(false);

  languages = [
    { code: 'pt', label: 'Português (Brasil)' },
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Español' },
  ];

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data } = await this.supabase.client
      .from('app_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      this.settings = { ...this.settings, ...data };
      this.activeLanguages = Array.isArray(this.settings.active_languages)
        ? this.settings.active_languages
        : ['pt'];
    }
  }

  isLanguageActive(code: string): boolean {
    return this.activeLanguages.includes(code);
  }

  toggleLanguage(code: string): void {
    const index = this.activeLanguages.indexOf(code);
    if (index > -1) {
      this.activeLanguages.splice(index, 1);
    } else {
      this.activeLanguages.push(code);
    }
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      await this.supabase.client.from('app_settings').upsert({
        user_id: user.id,
        default_language: this.settings.default_language,
        active_languages: this.activeLanguages,
        webhook_url: this.settings.webhook_url,
      });

      // Apply language
      this.i18n.changeLang(this.settings.default_language as any);

      this.toast.success('Configurações gerais salvas!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar');
    } finally {
      this.saving.set(false);
    }
  }
}
