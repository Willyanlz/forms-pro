import {
  Component,
  EventEmitter,
  HostListener,
  OnChanges,
  Output,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="onBackdropClick()"
        ></div>

        <!-- Panel -->
        <div
          class="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl
                 max-h-[90vh] flex flex-col
                 animate-slide-up sm:animate-none sm:scale-100"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <h2 class="text-base font-semibold text-text-primary">{{ title() }}</h2>
            <button
              type="button"
              (click)="close()"
              class="p-1.5 rounded-lg text-text-secondary hover:bg-surface transition-colors"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto px-5 py-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slide-up 0.25s ease-out;
    }
  `],
})
export class ModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');

  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
