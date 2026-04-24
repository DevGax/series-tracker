import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  previewUrl = input<string | null>(null);
  imageSelected = output<File | null>();

  private dragOver = false;
  error = signal<string | null>(null);

  dropzoneClass(): string {
    const base =
      'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800';
    const active = 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800';
    return this.dragOver ? active : base;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files?.length) this.procesarArchivo(files[0]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.procesarArchivo(input.files[0]);
  }

  private procesarArchivo(file: File): void {
    this.error.set(null);

    // Validar tipo
    const tiposValidos = ['image/png', 'image/jpeg', 'image/webp'];
    if (!tiposValidos.includes(file.type)) {
      this.error.set('Formato no válido. Usa PNG, JPG o WebP.');
      return;
    }

    // Validar tamaño (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      this.error.set('La imagen no puede superar 2MB.');
      return;
    }

    this.imageSelected.emit(file);
  }

  deletePreview(): void {
    this.imageSelected.emit(null);
  }
}
