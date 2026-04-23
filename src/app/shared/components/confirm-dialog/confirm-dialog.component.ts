import {
  Component,
  EventEmitter,
  HostListener,
  OnChanges,
  Output,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'confirm-title'"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
          <h2 id="confirm-title" class="text-base font-semibold text-text-primary mb-2">
            {{ title() }}
          </h2>
          <p class="text-sm text-text-secondary mb-4">{{ message() }}</p>

          @if (requiresTyping()) {
            <div class="mb-4">
              <label class="block text-xs font-medium text-text-secondary mb-1">
                Digite <strong class="text-text-primary">{{ confirmText() }}</strong> para confirmar
              </label>
              <input
                type="text"
                [(ngModel)]="typedValue"
                class="w-full px-3 py-2 text-sm border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-error/30 focus:border-error"
                [placeholder]="confirmText()"
              />
            </div>
          }

          <div class="flex gap-3 justify-end">
            <app-button variant="ghost" size="sm" (click)="onCancel()">
              Cancelar
            </app-button>
            <app-button
              variant="danger"
              size="sm"
              [disabled]="isConfirmDisabled()"
              (click)="onConfirm()"
            >
              {{ confirmText() }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class ConfirmDialogComponent {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('Tem certeza?');
  readonly message = input<string>('');
  readonly confirmText = input<string>('EXCLUIR');
  readonly requiresTyping = input<boolean>(false);

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  typedValue = '';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.onCancel();
  }

  isConfirmDisabled(): boolean {
    if (this.requiresTyping()) {
      return this.typedValue !== this.confirmText();
    }
    return false;
  }

  onConfirm(): void {
    if (this.isConfirmDisabled()) return;
    this.typedValue = '';
    this.confirmed.emit();
  }

  onCancel(): void {
    this.typedValue = '';
    this.cancelled.emit();
  }
}
