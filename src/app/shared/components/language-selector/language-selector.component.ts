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
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
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
