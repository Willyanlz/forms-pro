import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { AppSettings, createDefaultAppSettings } from '@core/models';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, NgxMaskDirective],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center gap-4">
          <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
          <div>
            <h1 class="text-xl font-semibold text-text-primary" i18n="@@whatsappSettings">WhatsApp</h1>
            <p class="text-sm text-text-secondary" i18n="@@whatsappSettingsDesc">Configure o WhatsApp para contato</p>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-6">
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-border p-6">
          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@whatsappNumber">
              Número do WhatsApp
            </label>
            <input
              type="text"
              [(ngModel)]="settings.whatsapp_number"
              name="whatsapp_number"
              mask="+55 (00) 00000-0000"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors"
              placeholder="+55 (11) 99999-9999"
            />
            <p class="text-xs text-text-secondary mt-1">
              Inclua o código do país (55 para Brasil)
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@defaultMessage">
              Mensagem Padrão
            </label>
            <textarea
              [(ngModel)]="whatsappMessage"
              name="whatsapp_message"
              rows="4"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors resize-none"
              placeholder="Olá, vim pelo formulário e gostaria de mais informações..."
            ></textarea>
            <p class="text-xs text-text-secondary mt-1">
              Use <code>{{ placeholderToken }}</code> para incluir o nome do respondente
            </p>
          </div>

          <!-- Preview -->
          <div class="mb-6 p-4 bg-surface rounded-lg">
            <p class="text-sm text-text-secondary mb-2">Preview do link</p>
            <a
              [href]="getWhatsAppLink()"
              target="_blank"
              class="text-primary hover:underline break-all"
            >
              {{ getWhatsAppLink() }}
            </a>
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
export class WhatsappComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  settings: AppSettings = createDefaultAppSettings();

  whatsappMessage = '';
  readonly placeholderToken = '{{nome}}';

  saving = signal(false);

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
      this.whatsappMessage = (this.settings.whatsapp_default_message as any)?.['pt'] || '';
    }
  }

  getWhatsAppLink(): string {
    if (!this.settings.whatsapp_number) return '#';
    const phone = this.settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(this.whatsappMessage || 'Olá, vim pelo formulário');
    return `https://wa.me/${phone}?text=${message}`;
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      await this.supabase.client.from('app_settings').upsert({
        user_id: user.id,
        whatsapp_number: this.settings.whatsapp_number,
        whatsapp_default_message: { pt: this.whatsappMessage },
      });

      this.toast.success('Configurações do WhatsApp salvas!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar');
    } finally {
      this.saving.set(false);
    }
  }
}
