import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { I18nService } from '@core/services/i18n.service';
import { ThemeService } from '@core/services/theme.service';
import { AdminProfile, AppSettings } from '@core/models';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LanguageSelectorComponent],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-2">
              <span class="text-2xl">📋</span>
              <span class="text-xl font-bold text-text-primary">Labs Will</span>
            </div>
            <div class="flex items-center gap-4">
              <app-language-selector />
              <a
                routerLink="/login"
                class="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                i18n="@@login"
              >
                Entrar
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section class="pt-32 pb-20 px-4">
        <div class="max-w-7xl mx-auto text-center">
          @if (loading()) {
            <div class="animate-pulse">
              <div class="h-12 bg-surface rounded w-64 mx-auto mb-4"></div>
              <div class="h-6 bg-surface rounded w-96 mx-auto"></div>
            </div>
          } @else {
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary">
              {{ profile()?.display_name || 'Labs Will' }}
            </h1>
            <p class="text-xl text-text-secondary mt-4 max-w-2xl mx-auto">
              {{ profile()?.description || 'Sistema de formulários dinâmicos' }}
            </p>
          }
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/forms"
              class="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg
                     hover:bg-primary-dark transition-colors"
              i18n="@@fillForm"
            >
              Preencher Formulário
            </a>
            <a
              href="https://wa.me/{{ getWhatsAppLink() }}"
              target="_blank"
              rel="noopener noreferrer"
              class="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg
                     hover:bg-primary hover:text-white transition-colors"
              i18n="@@talkOnWhatsApp"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <!-- Services Cards -->
      <section class="py-20 px-4 bg-surface">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center text-text-primary mb-12" i18n="@@ourServices">
            Nossos Serviços
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (service of services; track service.title) {
              <div class="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <div class="text-4xl mb-4">{{ service.icon }}</div>
                <h3 class="text-xl font-semibold text-text-primary mb-2">{{ service.title }}</h3>
                <p class="text-text-secondary">{{ service.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 px-4 border-t border-border">
        <div class="max-w-7xl mx-auto text-center text-text-secondary">
          <p>&copy; {{ currentYear }} Labs Will. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private i18n = inject(I18nService);
  private theme = inject(ThemeService);

  profile = signal<AdminProfile | null>(null);
  settings = signal<AppSettings | null>(null);
  loading = signal(true);

  services = [
    {
      icon: '📝',
      title: 'Formulários Dinâmicos',
      description: 'Crie e gerencie formulários personalizados com facilidade.',
    },
    {
      icon: '⚡',
      title: 'Respostas Rápidas',
      description: 'Receba notificações instantâneas quando alguém responder.',
    },
    {
      icon: '🔒',
      title: 'Dados Seguros',
      description: 'Seus dados protegidos com segurança de nível empresarial.',
    },
  ];

  get currentYear(): number {
    return new Date().getFullYear();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Try to load profile from Supabase
      const { data: profile } = await this.supabase.client
        .from('admin_profile')
        .select('*')
        .limit(1)
        .single();
      
      if (profile) {
        this.profile.set(profile as AdminProfile);
      }
    } catch (error) {
      console.error('Error loading landing data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getWhatsAppLink(): string {
    const profile = this.profile();
    if (profile?.whatsapp_number) {
      return profile.whatsapp_number.replace(/\D/g, '');
    }
    return '';
  }
}
