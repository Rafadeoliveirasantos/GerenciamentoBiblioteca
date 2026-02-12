import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LivroService } from '../../../core/services/livro.service';
import { AutorService } from '../../../core/services/autor.service';
import { GeneroService } from '../../../core/services/genero.service';
import { Livro } from '../../../core/models/livro.model';
import { Autor } from '../../../core/models/autor.model';
import { Genero } from '../../../core/models/genero.model';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Livro</h2>
    <mat-dialog-content>
      <form [formGroup]="formulario">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ISBN</mat-label>
          <input matInput formControlName="isbn">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ano de Publicação</mat-label>
          <input matInput type="number" formControlName="anoPublicacao">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Autor</mat-label>
          <mat-select formControlName="autorId">
            <mat-option *ngFor="let autor of listaAutores" [value]="autor.id">
              {{ autor.nome }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Gênero</mat-label>
          <mat-select formControlName="generoId">
            <mat-option *ngFor="let genero of listaGeneros" [value]="genero.id">
              {{ genero.nome }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL da Capa (opcional)</mat-label>
          <input matInput formControlName="capaUrl">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Sinopse (opcional)</mat-label>
          <textarea matInput formControlName="sinopse" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="salvar()" [disabled]="!formulario.valid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class LivroFormComponent implements OnInit {
  formulario: FormGroup;
  listaAutores: Autor[] = [];
  listaGeneros: Genero[] = [];

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private autorService: AutorService,
    private generoService: GeneroService,
    public dialogRef: MatDialogRef<LivroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Livro
  ) {
    // Cria o formulário com validações
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      isbn: ['', Validators.required],
      anoPublicacao: ['', [Validators.required, Validators.min(1000)]],
      autorId: ['', Validators.required],
      generoId: ['', Validators.required],
      capaUrl: [''],
      sinopse: ['']
    });

    // Se tiver dados, é edição
    if (data) {
      this.formulario.patchValue(data);
      console.log('Editando livro:', data.titulo);
    }
  }

  ngOnInit(): void {
    // Carrega lista de autores pro dropdown
    this.autorService.autores$.subscribe(autores => this.listaAutores = autores);
    // Carrega lista de gêneros pro dropdown
    this.generoService.generos$.subscribe(generos => this.listaGeneros = generos);
  }

  // FIXME: melhorar tratamento de erro com snackbar
  salvar(): void {
    if (this.formulario.valid) {
      const dadosLivro = this.formulario.value;
      
      // Se tem ID, é update, senão é create
      const operacao = this.data
        ? this.livroService.update(this.data.id, dadosLivro)
        : this.livroService.create(dadosLivro);

      operacao.subscribe({
        next: () => {
          console.log('Livro salvo com sucesso');
          this.dialogRef.close(true);
        },
        error: (erro) => {
          console.log('Erro ao salvar:', erro);
          alert(erro.error?.message || 'Erro ao salvar livro');
        }
      });
    }
  }
}
