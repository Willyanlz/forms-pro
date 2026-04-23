import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative flex items-center">
      <!-- Search icon -->
      <span class="absolute left-3 pointer-events-none text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      <input
        type="search"
        [placeholder]="placeholder()"
        [(ngModel)]="value"
        (ngModelChange)="onInput($event)"
        class="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-white
               focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
               placeholder:text-text-secondary transition-shadow"
      />

      <!-- Clear button -->
      @if (value) {
        <button
          type="button"
          (click)="clear()"
          class="absolute right-3 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Limpar busca"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
  styles: [],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  readonly placeholder = input<string>('Buscar...');

  @Output() searchChange = new EventEmitter<string>();

  value = '';
  private readonly input$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.input$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(v => this.searchChange.emit(v));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(value: string): void {
    this.input$.next(value);
  }

  clear(): void {
    this.value = '';
    this.input$.next('');
  }
}
