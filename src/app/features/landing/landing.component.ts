import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { I18nService } from '@core/services/i18n.service';
import { ThemeService } from '@core/services/theme.service';
import { AdminProfile, AppSettings } from '@core/models';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeSelectorComponent } from '@shared/components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    TranslateModule, 
    LanguageSelectorComponent,
    ThemeSelectorComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private i18n = inject(I18nService);
  private theme = inject(ThemeService);

  profile = signal<AdminProfile | null>(null);
  settings = signal<AppSettings | null>(null);
  loading = signal(true);

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
