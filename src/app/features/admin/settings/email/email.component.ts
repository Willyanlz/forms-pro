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
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
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
      resend: 'Resend API',
      smtp: 'SMTP Personalizado',
      none: 'Desativado',
    };
    return labels[provider] || provider;
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      const { error } = await this.supabase.client.from('app_settings').upsert({
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

      if (error) throw error;

      this.toast.success('Configurações de email salvas com sucesso!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar configurações');
    } finally {
      this.saving.set(false);
    }
  }
}
