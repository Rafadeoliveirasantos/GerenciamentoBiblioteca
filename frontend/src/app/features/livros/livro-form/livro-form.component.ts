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
      <form [formGroup]="form">
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
            <mat-option *ngFor="let autor of autores" [value]="autor.id">
              {{ autor.nome }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Gênero</mat-label>
          <mat-select formControlName="generoId">
            <mat-option *ngFor="let genero of generos" [value]="genero.id">
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
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.valid">Salvar</button>
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
  form: FormGroup;
  autores: Autor[] = [];
  generos: Genero[] = [];

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private autorService: AutorService,
    private generoService: GeneroService,
    public dialogRef: MatDialogRef<LivroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Livro
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      isbn: ['', Validators.required],
      anoPublicacao: ['', [Validators.required, Validators.min(1000)]],
      autorId: ['', Validators.required],
      generoId: ['', Validators.required],
      capaUrl: [''],
      sinopse: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.autorService.autores$.subscribe(autores => this.autores = autores);
    this.generoService.generos$.subscribe(generos => this.generos = generos);
  }

  save(): void {
    if (this.form.valid) {
      const livro = this.form.value;
      const operation = this.data
        ? this.livroService.update(this.data.id, livro)
        : this.livroService.create(livro);

      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => alert(error.error?.message || 'Erro ao salvar livro')
      });
    }
  }
}
