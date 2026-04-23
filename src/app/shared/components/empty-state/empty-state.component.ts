import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <!-- Icon placeholder -->
      <div class="mb-4 w-16 h-16 rounded-full bg-surface flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          @switch (icon()) {
            @case ('inbox') {
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 008.586 13H6" />
            }
            @case ('search') {
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            }
            @default {
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 008.586 13H6" />
            }
          }
        </svg>
      </div>

      <h3 class="text-base font-semibold text-text-primary mb-1">{{ title() }}</h3>
      <p class="text-sm text-text-secondary mb-4">{{ message() }}</p>

      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class EmptyStateComponent {
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly icon = input<string>('inbox');
}
