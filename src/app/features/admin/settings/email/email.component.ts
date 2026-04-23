import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { AppSettings, createDefaultAppSettings, EmailProvider } from '@core/models';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center gap-4">
          <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
          <div>
            <h1 class="text-xl font-semibold text-text-primary" i18n="@@emailSettings">Configurações de Email</h1>
            <p class="text-sm text-text-secondary" i18n="@@emailSettingsDesc">Configure como você recebe notificações</p>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-6">
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-border p-6">
          <!-- Provider Tabs -->
          <div class="flex border-b border-border mb-6">
            @for (provider of providers; track provider) {
              <button
                type="button"
                (click)="settings.email_provider = provider"
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                [class]="settings.email_provider === provider
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'"
              >
                {{ getProviderLabel(provider) }}
              </button>
            }
          </div>

          @switch (settings.email_provider) {
            @case ('resend') {
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@resendApiKey">
                    API Key do Resend
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="settings.resend_api_key"
                    name="resend_api_key"
                    class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                           focus:border-primary outline-none transition-colors"
                    placeholder="re_xxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@resendFromEmail">
                    Email de Remetente
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="settings.resend_from_email"
                    name="resend_from_email"
                    class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                           focus:border-primary outline-none transition-colors"
                    placeholder="noreply@seudominio.com"
                  />
                </div>
              </div>
            }
            @case ('smtp') {
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@smtpHost">
                      Servidor SMTP
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="settings.smtp_host"
                      name="smtp_host"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@smtpPort">
                      Porta
                    </label>
                    <input
                      type="number"
                      [(ngModel)]="settings.smtp_port"
                      name="smtp_port"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                      placeholder="587"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@smtpUser">
                      Usuário
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="settings.smtp_user"
                      name="smtp_user"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@smtpPassword">
                      Senha
                    </label>
                    <input
                      type="password"
                      [(ngModel)]="settings.smtp_password"
                      name="smtp_password"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@smtpFromEmail">
                    Email de Remetente
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="settings.smtp_from_email"
                    name="smtp_from_email"
                    class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                           focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    [(ngModel)]="settings.smtp_secure"
                    name="smtp_secure"
                    id="smtp_secure"
                    class="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label for="smtp_secure" class="text-sm text-text-primary" i18n="@@useTls">
                    Usar TLS/SSL
                  </label>
                </div>
              </div>
            }
            @case ('none') {
              <div class="text-center py-8">
                <div class="text-4xl mb-4">📧</div>
                <p class="text-text-secondary" i18n="@@noEmailConfigured">
                  Nenhum provedor de email configurado. As notificações serão desativadas.
                </p>
              </div>
            }
          }

          <div class="mt-6 pt-6 border-t border-border">
            <button
              type="submit"
              [disabled]="saving()"
              class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark
                     transition-colors disabled:opacity-50"
            >
              {{ saving() ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class EmailComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  settings: AppSettings = createDefaultAppSettings();
  readonly providers: EmailProvider[] = ['resend', 'smtp', 'none'];

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
    }
  }

  getProviderLabel(provider: string): string {
    const labels: Record<string, string> = {
      resend: 'Resend',
      smtp: 'SMTP',
      none: 'Nenhum',
    };
    return labels[provider] || provider;
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      await this.supabase.client.from('app_settings').upsert({
        user_id: user.id,
        email_provider: this.settings.email_provider,
        resend_api_key: this.settings.resend_api_key,
        resend_from_email: this.settings.resend_from_email,
        smtp_host: this.settings.smtp_host,
        smtp_port: this.settings.smtp_port,
        smtp_user: this.settings.smtp_user,
        smtp_password: this.settings.smtp_password,
        smtp_from_email: this.settings.smtp_from_email,
        smtp_secure: this.settings.smtp_secure,
      });

      this.toast.success('Configurações de email salvas!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar');
    } finally {
      this.saving.set(false);
    }
  }
}
