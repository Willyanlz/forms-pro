import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [ngClass]="hostClasses()"
      class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      @if (loading()) {
        <svg
          class="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');

  hostClasses(): Record<string, boolean> {
    return {
      // Sizes
      'px-3 py-1.5 text-sm': this.size() === 'sm',
      'px-4 py-2 text-sm': this.size() === 'md',
      'px-6 py-3 text-base': this.size() === 'lg',

      // Variants
      'bg-primary text-white hover:bg-primary-dark focus:ring-primary': this.variant() === 'primary',
      'bg-secondary text-white hover:opacity-90 focus:ring-secondary': this.variant() === 'secondary',
      'bg-transparent border border-border text-text-primary hover:bg-surface focus:ring-border':
        this.variant() === 'ghost',
      'bg-error text-white hover:opacity-90 focus:ring-error': this.variant() === 'danger',
    };
  }
}
