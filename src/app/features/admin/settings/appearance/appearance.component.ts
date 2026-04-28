import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { ToastService } from '@core/services/toast.service';
import { AppSettings, createDefaultAppSettings } from '@core/models';

@Component({
  selector: 'app-appearance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private toast = inject(ToastService);

  settings: AppSettings = createDefaultAppSettings();

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

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      await this.supabase.client.from('app_settings').upsert({
        user_id: user.id,
        primary_color: this.settings.primary_color,
        secondary_color: this.settings.secondary_color,
        accent_color: this.settings.accent_color,
      });

      // Apply theme
      this.theme.applyColors(this.settings);

      this.toast.success('Cores salvas com sucesso!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar');
    } finally {
      this.saving.set(false);
    }
  }

  resetDefaults(): void {
    this.settings.primary_color = '#F5A623';
    this.settings.secondary_color = '#1A1A2E';
    this.settings.accent_color = '#E8F4FD';
  }
}
