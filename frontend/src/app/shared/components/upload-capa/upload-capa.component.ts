import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LivroService } from '../../../core/services/livro.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { Livro } from '../../../core/models/livro.model';

@Component({
  selector: 'app-upload-capa',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <h2 mat-dialog-title>Alterar Capa - {{ data.titulo }}</h2>
    <mat-dialog-content>
      <div class="upload-container">
        <div class="preview" *ngIf="previewUrl || data.capaUrl">
          <img [src]="previewUrl || data.capaUrl" alt="Preview">
        </div>
        <div class="drop-zone" 
             (dragover)="onDragOver($event)" 
             (drop)="onDrop($event)"
             (click)="fileInput.click()">
          <mat-icon>cloud_upload</mat-icon>
          <p>Arraste uma imagem ou clique para selecionar</p>
          <p class="hint">JPG, JPEG ou PNG (máx 5MB)</p>
        </div>
        <input #fileInput type="file" accept="image/jpeg,image/jpg,image/png" 
               (change)="onFileSelected($event)" style="display: none">
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        <mat-progress-bar *ngIf="uploading" mode="indeterminate"></mat-progress-bar>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-button color="warn" (click)="removeCapa()" *ngIf="data.capaUrl" [disabled]="uploading">
        Remover Capa
      </button>
      <button mat-raised-button color="primary" (click)="upload()" 
              [disabled]="!selectedFile || uploading">
        Upload
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .upload-container {
      min-height: 300px;
    }
    .preview {
      text-align: center;
      margin-bottom: 20px;
    }
    .preview img {
      max-width: 100%;
      max-height: 300px;
      border-radius: 4px;
    }
    .drop-zone {
      border: 2px dashed #0078D4;
      border-radius: 4px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .drop-zone:hover {
      background-color: #F5F5F5;
    }
    .drop-zone mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #0078D4;
    }
    .hint {
      font-size: 12px;
      color: #605E5C;
      margin-top: 8px;
    }
    .error-message {
      color: #D13438;
      margin-top: 16px;
      text-align: center;
    }
  `]
})
export class UploadCapaComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  errorMessage = '';

  constructor(
    private livroService: LivroService,
    private fileUploadService: FileUploadService,
    public dialogRef: MatDialogRef<UploadCapaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Livro
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file: File): void {
    const validation = this.fileUploadService.validateFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || '';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
    this.fileUploadService.getFilePreview(file).then(preview => {
      this.previewUrl = preview;
    });
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.errorMessage = '';
    this.livroService.uploadCapa(this.data.id, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.uploading = false;
        this.errorMessage = error.error?.message || 'Erro ao fazer upload';
      }
    });
  }

  removeCapa(): void {
    if (confirm('Deseja realmente remover a capa?')) {
      this.livroService.removerCapa(this.data.id).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao remover capa';
        }
      });
    }
  }
}
