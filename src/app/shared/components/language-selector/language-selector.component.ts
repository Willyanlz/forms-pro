import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, LanguageCode } from '../../../core/services/i18n.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div class="relative" (appClickOutside)="isOpen.set(false)">
      <button
        type="button"
        (click)="isOpen.set(!isOpen())"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border
               text-sm font-medium text-text-primary bg-white hover:bg-surface transition-colors"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen()"
      >
        <span>{{ currentLang().flag }}</span>
        <span>{{ currentLang().label }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-text-secondary" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      @if (isOpen()) {
        <ul
          class="absolute right-0 mt-1 w-36 bg-white border border-border rounded-xl shadow-lg z-20 py-1"
          role="listbox"
        >
          @for (lang of languages; track lang.code) {
            <li
              role="option"
              [attr.aria-selected]="i18nService.currentLang() === lang.code"
              (click)="select(lang.code)"
              class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary
                     hover:bg-surface cursor-pointer transition-colors"
              [class.font-semibold]="i18nService.currentLang() === lang.code"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [],
})
export class LanguageSelectorComponent {
  readonly i18nService = inject(I18nService);

  isOpen = signal(false);

  readonly languages: LanguageOption[] = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  currentLang(): LanguageOption {
    return this.languages.find(l => l.code === this.i18nService.currentLang()) ?? this.languages[0];
  }

  select(code: LanguageCode): void {
    this.i18nService.changeLang(code);
    this.isOpen.set(false);
  }
}
