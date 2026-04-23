import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { AdminProfile } from '@core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, NgxMaskDirective],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center gap-4">
          <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
          <div>
            <h1 class="text-xl font-semibold text-text-primary" i18n="@@profile">Perfil</h1>
            <p class="text-sm text-text-secondary" i18n="@@profileDesc">Gerencie suas informações</p>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-6">
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-border p-6">
          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@displayName">
              Nome de exibição
            </label>
            <input
              type="text"
              [(ngModel)]="profile.display_name"
              name="display_name"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@description">
              Descrição
            </label>
            <textarea
              [(ngModel)]="profile.description"
              name="description"
              rows="4"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text-primary mb-2" i18n="@@whatsapp">
              WhatsApp
            </label>
            <input
              type="text"
              [(ngModel)]="profile.whatsapp_number"
              name="whatsapp_number"
              mask="+55 (00) 00000-0000"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                     focus:border-primary outline-none transition-colors"
            />
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
export class ProfileComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  profile: AdminProfile = {
    id: '',
    user_id: '',
    slug: null,
    display_name: '',
    description: '',
    photo_url: null,
    whatsapp_number: '',
    created_at: '',
    updated_at: '',
  };

  saving = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data } = await this.supabase.client
      .from('admin_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      this.profile = data as AdminProfile;
    }
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      await this.supabase.client.from('admin_profile').upsert({
        user_id: user.id,
        display_name: this.profile.display_name,
        description: this.profile.description,
        whatsapp_number: this.profile.whatsapp_number,
      });

      this.toast.success('Perfil salvo com sucesso!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar perfil');
    } finally {
      this.saving.set(false);
    }
  }
}
