import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly allowedExtensions = ['jpg', 'jpeg', 'png'];
  private readonly maxFileSize = 5 * 1024 * 1024;

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'Nenhum arquivo selecionado' };
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.allowedExtensions.includes(extension)) {
      return { valid: false, error: 'Formato inválido. Apenas JPG, JPEG e PNG são permitidos' };
    }

    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'Arquivo muito grande. Tamanho máximo: 5MB' };
    }

    return { valid: true };
  }

  getFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
