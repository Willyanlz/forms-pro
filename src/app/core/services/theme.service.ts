import { Injectable, signal } from '@angular/core';
import { AppSettings } from '../models/app-settings.model';

const DEFAULT_PRIMARY_COLOR = '#6366f1';
const DEFAULT_SECONDARY_COLOR = '#8b5cf6';
const DEFAULT_ACCENT_COLOR = '#06b6d4';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal(false);

  initTheme(): void {
    // Primeiro verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem('app_theme');

    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.isDarkMode.set(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return;
    }

    // Se não tiver salvo, detectar do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.set(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  }

  applyColors(settings: AppSettings): void {
    const root = document.documentElement;
    root.style.setProperty(
      '--color-primary',
      settings.primary_color ?? DEFAULT_PRIMARY_COLOR
    );
    root.style.setProperty(
      '--color-secondary',
      settings.secondary_color ?? DEFAULT_SECONDARY_COLOR
    );
    root.style.setProperty(
      '--color-accent',
      settings.accent_color ?? DEFAULT_ACCENT_COLOR
    );
  }
}
