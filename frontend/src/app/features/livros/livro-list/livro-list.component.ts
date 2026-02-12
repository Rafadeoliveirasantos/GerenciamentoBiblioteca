import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LivroService } from '../../../core/services/livro.service';
import { AutorService } from '../../../core/services/autor.service';
import { GeneroService } from '../../../core/services/genero.service';
import { Livro } from '../../../core/models/livro.model';
import { LivroFormComponent } from '../livro-form/livro-form.component';
import { UploadCapaComponent } from '../../../shared/components/upload-capa/upload-capa.component';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Livros</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Novo Livro
        </button>
      </div>
      <div *ngIf="carregando" class="loading-spinner">
        <mat-spinner></mat-spinner>
      </div>
      <div class="grid" *ngIf="!carregando">
        <div class="book-card" *ngFor="let livro of listaLivros">
          <img [src]="livro.capaUrl || 'assets/no-cover.png'" 
               [alt]="livro.titulo" 
               class="book-cover"
               (error)="onImageError($event)">
          <div class="book-info">
            <h3 class="book-title" [title]="livro.titulo">{{ livro.titulo }}</h3>
            <p class="book-author">{{ livro.autorNome }}</p>
            <p class="book-genre">{{ livro.generoNome }}</p>
            <p class="book-isbn">ISBN: {{ livro.isbn }}</p>
            <div class="book-actions">
              <button mat-icon-button color="primary" (click)="openUpload(livro)" title="Alterar Capa">
                <mat-icon>photo_camera</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="openForm(livro)" title="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(livro)" title="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .book-isbn {
      font-size: 12px;
      color: #605E5C;
      margin-top: 4px;
    }
    .book-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }
  `]
})
export class LivroListComponent implements OnInit {
  listaLivros: Livro[] = [];
  carregando = false;

  constructor(
    private livroService: LivroService,
    private autorService: AutorService,
    private generoService: GeneroService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // Carrega lista de livros, autores e gêneros
  carregarDados(): void {
    this.carregando = true;
    // Pré-carrega autores e gêneros pro dropdown
    this.autorService.getAll().subscribe();
    this.generoService.getAll().subscribe();
    
    this.livroService.getAll().subscribe({
      next: (dados) => {
        this.listaLivros = dados;
        console.log('Livros carregados:', dados.length);
        this.carregando = false;
      },
      error: (erro) => {
        console.log('Erro ao carregar livros:', erro);
        this.carregando = false;
      }
    });
  }

  openForm(livro?: Livro): void {
    const dialogRef = this.dialog.open(LivroFormComponent, {
      width: '600px',
      data: livro
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.carregarDados();
      }
    });
  }

  openUpload(livro: Livro): void {
    const dialogRef = this.dialog.open(UploadCapaComponent, {
      width: '500px',
      data: livro
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // Recarrega a lista pra mostrar a nova capa
        this.carregarDados();
      }
    });
  }

  // TODO: adicionar confirmação com modal do Material
  delete(livro: Livro): void {
    if (confirm(`Deseja realmente excluir o livro "${livro.titulo}"?`)) {
      this.livroService.delete(livro.id).subscribe(() => {
        console.log('Livro excluído:', livro.titulo);
        this.carregarDados();
      });
    }
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERUJFOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2MDVFNUMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gQ2FwYTwvdGV4dD48L3N2Zz4=';
  }
}
