import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GeneroService } from '../../../core/services/genero.service';
import { Genero } from '../../../core/models/genero.model';
import { GeneroFormComponent } from '../genero-form/genero-form.component';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Gêneros</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Novo Gênero
        </button>
      </div>
      <table mat-table [dataSource]="generos" class="mat-elevation-z2">
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let genero">{{ genero.nome }}</td>
        </ng-container>
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let genero">{{ genero.descricao }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let genero">
            <button mat-icon-button color="primary" (click)="openForm(genero)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(genero)">
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
export class GeneroListComponent implements OnInit {
  generos: Genero[] = [];
  displayedColumns = ['nome', 'descricao', 'actions'];

  constructor(private generoService: GeneroService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.generoService.getAll().subscribe(generos => this.generos = generos);
  }

  openForm(genero?: Genero): void {
    const dialogRef = this.dialog.open(GeneroFormComponent, {
      width: '600px',
      data: genero
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.loadData();
    });
  }

  delete(genero: Genero): void {
    if (confirm(`Deseja realmente excluir o gênero "${genero.nome}"?`)) {
      this.generoService.delete(genero.id).subscribe(() => this.loadData());
    }
  }
}
