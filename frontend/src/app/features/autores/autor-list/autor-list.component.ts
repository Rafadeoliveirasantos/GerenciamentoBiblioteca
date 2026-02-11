import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AutorService } from '../../../core/services/autor.service';
import { Autor } from '../../../core/models/autor.model';
import { AutorFormComponent } from '../autor-form/autor-form.component';

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Autores</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Novo Autor
        </button>
      </div>
      <table mat-table [dataSource]="autores" class="mat-elevation-z2">
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let autor">{{ autor.nome }}</td>
        </ng-container>
        <ng-container matColumnDef="dataNascimento">
          <th mat-header-cell *matHeaderCellDef>Data de Nascimento</th>
          <td mat-cell *matCellDef="let autor">{{ autor.dataNascimento | date:'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let autor">
            <button mat-icon-button color="primary" (click)="openForm(autor)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(autor)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class AutorListComponent implements OnInit {
  autores: Autor[] = [];
  displayedColumns = ['nome', 'dataNascimento', 'actions'];

  constructor(private autorService: AutorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.autorService.getAll().subscribe(autores => this.autores = autores);
  }

  openForm(autor?: Autor): void {
    const dialogRef = this.dialog.open(AutorFormComponent, {
      width: '600px',
      data: autor
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.loadData();
    });
  }

  delete(autor: Autor): void {
    if (confirm(`Deseja realmente excluir o autor "${autor.nome}"?`)) {
      this.autorService.delete(autor.id).subscribe(() => this.loadData());
    }
  }
}
