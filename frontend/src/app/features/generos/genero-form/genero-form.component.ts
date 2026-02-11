import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GeneroService } from '../../../core/services/genero.service';
import { Genero } from '../../../core/models/genero.model';

@Component({
  selector: 'app-genero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Gênero</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="descricao" rows="3"></textarea>
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
export class GeneroFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private generoService: GeneroService,
    public dialogRef: MatDialogRef<GeneroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Genero
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  save(): void {
    if (this.form.valid) {
      const genero = this.form.value;
      const operation = this.data
        ? this.generoService.update(this.data.id, genero)
        : this.generoService.create(genero);

      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error: any) => alert(error.error?.message || 'Erro ao salvar gênero')
      });
    }
  }
}
