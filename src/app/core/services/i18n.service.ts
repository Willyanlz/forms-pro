import { Injectable, signal, ApplicationRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageCode, TranslatedField } from '../models/translated-field.model';
export type { LanguageCode } from '../models/translated-field.model';

const SUPPORTED_LANGS: LanguageCode[] = ['pt', 'en', 'es'];
const DEFAULT_LANG: LanguageCode = 'pt';

@Injectable({ providedIn: 'root' })
export class I18nService {
  currentLang = signal<LanguageCode>(DEFAULT_LANG);

  private readonly appRef = inject(ApplicationRef);

  constructor(private readonly translate: TranslateService) { }

  init(): void {
    this.translate.addLangs(SUPPORTED_LANGS);
    this.translate.setDefaultLang(DEFAULT_LANG);

    // Primeiro verificar idioma salvo no localStorage
    const savedLang = localStorage.getItem('app_language') as LanguageCode;

    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
      this.currentLang.set(savedLang);
      this.translate.use(savedLang);
      return;
    }

    // Se não tiver salvo, detectar do navegador
    const browserLang = navigator.language?.split('-')[0] as LanguageCode;
    const detected: LanguageCode = SUPPORTED_LANGS.includes(browserLang)
      ? browserLang
      : DEFAULT_LANG;

    this.currentLang.set(detected);
    this.translate.use(detected);
  }

  changeLang(lang: LanguageCode): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem('app_language', lang);

    // ✅ CORREÇÃO DEFINITIVA PARA ATUALIZAR TRADUÇÕES
    // Força detecção de mudanças em toda a aplicação para atualizar todos os pipes | translate
    setTimeout(() => {
      this.appRef.tick();
    }, 100);
  }

  resolveTranslated(
    field: TranslatedField | string | null | undefined,
    fallbackLang?: LanguageCode
  ): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    const primary = fallbackLang ?? this.currentLang();
    const defaultLang = DEFAULT_LANG;

    // Requested lang → default lang → first available → ''
    if (field[primary]) return field[primary]!;
    if (field[defaultLang]) return field[defaultLang]!;

    const firstAvailable = SUPPORTED_LANGS.find((l) => field[l]);
    return firstAvailable ? field[firstAvailable]! : '';
  }
}
