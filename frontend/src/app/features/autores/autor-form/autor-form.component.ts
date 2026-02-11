import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AutorService } from '../../../core/services/autor.service';
import { Autor } from '../../../core/models/autor.model';

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Novo' }} Autor</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Nascimento</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dataNascimento">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Biografia</mat-label>
          <textarea matInput formControlName="biografia" rows="4"></textarea>
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
export class AutorFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autorService: AutorService,
    public dialogRef: MatDialogRef<AutorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Autor
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: [''],
      biografia: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  save(): void {
    if (this.form.valid) {
      const autor = this.form.value;
      const operation = this.data
        ? this.autorService.update(this.data.id, autor)
        : this.autorService.create(autor);

      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error: any) => alert(error.error?.message || 'Erro ao salvar autor')
      });
    }
  }
}
