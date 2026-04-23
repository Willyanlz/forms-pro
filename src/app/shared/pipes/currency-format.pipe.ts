import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency: string = 'BRL'): string {
    if (amount == null) return '';
    return new Intl.NumberFormat(this.localeForCurrency(currency), {
      style: 'currency',
      currency,
    }).format(amount);
  }

  private localeForCurrency(currency: string): string {
    const map: Record<string, string> = {
      BRL: 'pt-BR',
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
    };
    return map[currency] ?? 'pt-BR';
  }
}
