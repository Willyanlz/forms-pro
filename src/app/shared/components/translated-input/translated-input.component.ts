import {
  Component,
  OnChanges,
  SimpleChanges,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export type LanguageCode = 'pt' | 'en' | 'es';
export type TranslatedField = Partial<Record<LanguageCode, string>>;

@Component({
  selector: 'app-translated-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslatedInputComponent),
      multi: true,
    },
  ],
  template: `
    <div>
      @if (label()) {
        <label class="block text-sm font-medium text-text-primary mb-1">{{ label() }}</label>
      }

      <!-- Language tabs -->
      <div class="flex border-b border-border mb-2">
        @for (lang of activeLanguages(); track lang) {
          <button
            type="button"
            (click)="activeTab.set(lang)"
            [class.text-primary]="activeTab() === lang"
            [class.border-primary]="activeTab() === lang"
            [class.border-b-2]="activeTab() === lang"
            class="px-3 py-1.5 text-sm font-medium text-text-secondary
                   hover:text-text-primary transition-colors -mb-px"
          >
            {{ langLabel(lang) }}
          </button>
        }
      </div>

      <!-- Input per active tab -->
      @for (lang of activeLanguages(); track lang) {
        @if (activeTab() === lang) {
          <input
            type="text"
            [value]="value()[lang] ?? ''"
            (input)="onLangInput($event, lang)"
            (blur)="onTouched()"
            [disabled]="isDisabled"
            class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                   disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
          />
        }
      }
    </div>
  `,
  styles: [],
})
export class TranslatedInputComponent implements ControlValueAccessor, OnChanges {
  readonly activeLanguages = input<LanguageCode[]>(['pt']);
  readonly label = input<string>('');

  activeTab = signal<LanguageCode>('pt');
  value = signal<TranslatedField>({});
  isDisabled = false;

  private onChange: (v: TranslatedField) => void = () => {};
  onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeLanguages']) {
      const langs = this.activeLanguages();
      if (langs.length && !langs.includes(this.activeTab())) {
        this.activeTab.set(langs[0]);
      }
    }
  }

  writeValue(val: TranslatedField): void {
    this.value.set(val ?? {});
  }

  registerOnChange(fn: (v: TranslatedField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onLangInput(event: Event, lang: LanguageCode): void {
    const text = (event.target as HTMLInputElement).value;
    const updated = { ...this.value(), [lang]: text };
    this.value.set(updated);
    this.onChange(updated);
  }

  langLabel(lang: LanguageCode): string {
    const labels: Record<LanguageCode, string> = { pt: 'PT 🇧🇷', en: 'EN 🇺🇸', es: 'ES 🇪🇸' };
    return labels[lang];
  }
}
