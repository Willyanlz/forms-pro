import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-[100] flex flex-col gap-2
             bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm
             sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:w-auto sm:max-w-xs"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [ngClass]="toastClasses(toast.type)"
          class="flex items-start gap-3 p-4 rounded-xl shadow-lg text-sm
                 animate-scale-in"
          role="alert"
        >
          <!-- Icon -->
          <span class="shrink-0 mt-0.5" [innerHTML]="iconSvg(toast.type)" aria-hidden="true"></span>

          <!-- Message -->
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>

          <!-- Close -->
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
  `],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  toastClasses(type: string): Record<string, boolean> {
    return {
      'bg-green-50 text-green-800 border border-green-200':  type === 'success',
      'bg-red-50 text-red-800 border border-red-200':        type === 'error',
      'bg-yellow-50 text-yellow-800 border border-yellow-200': type === 'warning',
      'bg-blue-50 text-blue-800 border border-blue-200':     type === 'info',
    };
  }

  iconSvg(type: string): string {
    const icons: Record<string, string> = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`,
      error:   `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" /></svg>`,
      info:    `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" /></svg>`,
    };
    return icons[type] ?? icons['info'];
  }
}
