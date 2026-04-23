import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const DEFAULT_DURATION = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  private add(
    message: string,
    type: Toast['type'],
    duration = DEFAULT_DURATION
  ): void {
    const id = crypto.randomUUID();
    this.toasts.update((current) => [...current, { id, message, type, duration }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration?: number): void {
    this.add(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.add(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.add(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.add(message, 'info', duration);
  }

  dismiss(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
