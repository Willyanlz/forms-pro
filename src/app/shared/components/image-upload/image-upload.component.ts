import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-3">
      <!-- Preview / Drop zone -->
      <div
        class="relative w-full aspect-video max-h-48 rounded-xl border-2 border-dashed
               border-border bg-surface flex flex-col items-center justify-center
               cursor-pointer hover:border-primary/60 transition-colors overflow-hidden"
        [class.border-primary]="isDragging()"
        [class.bg-primary/5]="isDragging()"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="isDragging.set(false)"
        (drop)="onDrop($event)"
        role="button"
        tabindex="0"
        (keydown.enter)="fileInput.click()"
        aria-label="Selecionar imagem"
      >
        @if (previewUrl()) {
          <img
            [src]="previewUrl()"
            alt="Preview"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity
                      flex items-center justify-center">
            <span class="text-white text-sm font-medium">Trocar imagem</span>
          </div>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-text-secondary mb-2"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14
                 m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-text-secondary">
            Arraste uma imagem ou <span class="text-primary font-medium">clique para selecionar</span>
          </p>
          <p class="text-xs text-text-secondary mt-1">PNG, JPG, WEBP — máx. {{ maxSizeMb() }} MB</p>
        }
      </div>

      <!-- Error message -->
      @if (errorMessage()) {
        <p class="text-xs text-error">{{ errorMessage() }}</p>
      }

      <!-- Hidden file input -->
      <input
        #fileInput
        type="file"
        accept="image/*"
        class="hidden"
        (change)="onFileSelected($event)"
      />
    </div>
  `,
  styles: [],
})
export class ImageUploadComponent {
  readonly currentImageUrl = input<string | null>(null);
  readonly maxSizeMb = input<number>(2);

  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  previewUrl = signal<string | null>(null);
  isDragging = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.currentImageUrl()) {
      this.previewUrl.set(this.currentImageUrl());
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    this.errorMessage.set(null);

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Apenas arquivos de imagem são permitidos.');
      return;
    }

    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    if (file.size > maxBytes) {
      this.errorMessage.set(`O arquivo excede o tamanho máximo de ${this.maxSizeMb()} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }
}
