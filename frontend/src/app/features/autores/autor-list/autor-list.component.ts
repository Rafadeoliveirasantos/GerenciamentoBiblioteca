import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AutorService } from '../../../core/services/autor.service';
import { Autor } from '../../../core/models/autor.model';
import { AutorFormComponent } from '../autor-form/autor-form.component';

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="autores-container">
      <div class="header">
        <div class="header-top">
          <h1>✍️ Autores</h1>
          <button class="btn-novo" (click)="novoAutor()">
            ➕ Novo Autor
          </button>
        </div>
        <p class="subtitle">Conheça os autores da nossa biblioteca</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando autores...</p>
      </div>

      <div *ngIf="!loading" class="autores-grid">
        <div class="autor-card" *ngFor="let autor of autores; let i = index" (click)="filtrarPorAutor(autor)" style="cursor: pointer;">
          <div class="autor-avatar" [style.background]="getCorAvatar(i)">
            {{ autor.nome.charAt(0) }}
          </div>
          <div class="autor-info">
            <h3>{{ autor.nome }}</h3>
            <p class="biografia" *ngIf="autor.biografia">{{ autor.biografia }}</p>
            <p class="data-nascimento" *ngIf="autor.dataNascimento">
              <span class="icon">📅</span>
              {{ autor.dataNascimento | date:'dd/MM/yyyy' }}
            </p>
            <div class="autor-acoes">
              <button class="btn btn-editar" (click)="editarAutor(autor); $event.stopPropagation()">
                ✏️ Editar
              </button>
              <button class="btn btn-deletar" (click)="deletarAutor(autor.id); $event.stopPropagation()">
                🗑️ Deletar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && autores.length === 0" class="empty-state">
        <p>📚 Nenhum autor cadastrado</p>
      </div>
    </div>
  `,
  styles: [`
    .autores-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .btn-novo {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .btn-novo:hover {
      background: linear-gradient(135deg, #45a049, #388E3C);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }

    .header h1 {
      font-size: 42px;
      font-weight: 800;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .subtitle {
      font-size: 18px;
      color: #6b7280;
    }

    .loading {
      text-align: center;
      padding: 80px 20px;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .loading p {
      color: #6b7280;
      font-size: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .autores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .autor-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .autor-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(102, 126, 234, 0.25);
    }

    .autor-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .autor-info {
      flex: 1;
    }

    .autor-info h3 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .biografia {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .data-nascimento {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #9ca3af;
      font-size: 13px;
      margin: 0;
    }

    .icon {
      font-size: 14px;
    }

    .autor-acoes {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .btn {
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-editar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-editar:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }

    .btn-deletar {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .btn-deletar:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    }

    .empty-state {
      text-align: center;
      padding: 100px 20px;
      font-size: 20px;
      color: #9ca3af;
    }
  `]
})
export class AutorListComponent implements OnInit {
  autores: Autor[] = [];
  loading = true;

  cores = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
  ];

  constructor(
    private autorService: AutorService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarAutores();
  }

  carregarAutores(): void {
    this.loading = true;
    this.autorService.getAll().subscribe({
      next: (autores) => {
        this.autores = autores;
        this.loading = false;
        console.log('✅ Autores carregados:', autores.length);
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar autores:', erro);
        this.loading = false;
      }
    });
  }

  getCorAvatar(index: number): string {
    return this.cores[index % this.cores.length];
  }

  novoAutor(): void {
    const dialogRef = this.dialog.open(AutorFormComponent, {
      width: '500px',
      data: null
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.carregarAutores();
    });
  }

  editarAutor(autor: Autor): void {
    const dialogRef = this.dialog.open(AutorFormComponent, {
      width: '500px',
      data: autor
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.carregarAutores();
    });
  }

  deletarAutor(id: string): void {
    if (confirm('Deseja realmente deletar este autor?')) {
      this.autorService.delete(id).subscribe({
        next: () => this.carregarAutores(),
        error: (erro: any) => alert(erro.error?.message || 'Erro ao deletar autor')
      });
    }
  }

  filtrarPorAutor(autor: Autor): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 FILTRAR POR AUTOR');
    console.log('Autor selecionado:', autor.nome);
    console.log('ID do autor:', autor.id);
    
    this.router.navigate(['/livros'], {
      queryParams: {
        autorId: autor.id,
        autorNome: autor.nome
      }
    });
    
    console.log('✅ Navegação executada para /livros');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}
