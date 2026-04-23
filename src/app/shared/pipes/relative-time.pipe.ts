import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import type { Locale } from 'date-fns';

type SupportedLocale = 'pt' | 'en' | 'es';

const LOCALE_MAP: Record<SupportedLocale, Locale> = {
  pt: ptBR,
  en: enUS,
  es: es,
};

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, locale: SupportedLocale = 'pt'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: LOCALE_MAP[locale] ?? ptBR,
    });
  }
}
