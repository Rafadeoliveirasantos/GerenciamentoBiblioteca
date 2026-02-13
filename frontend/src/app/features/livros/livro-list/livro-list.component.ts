import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LivroService } from '../../../core/services/livro.service';
import { Livro } from '../../../core/models/livro.model';
import { LivroFormComponent } from '../livro-form/livro-form.component';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './livro-list.component.html',
  styles: [`
    .livros-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
      max-width: 1400px;
      margin: 0 auto 48px;
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
      margin: 0;
    }

    .filtro-ativo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
      padding: 16px 24px;
      background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
      border-radius: 12px;
      border: 2px solid #fecaca;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .filtro-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filtro-badge mat-icon {
      color: #dc2626;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .filtro-badge span {
      font-size: 15px;
      color: #374151;
    }

    .filtro-badge strong {
      color: #dc2626;
      font-weight: 700;
    }

    button[mat-raised-button] {
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%) !important;
      color: white !important;
      border: none !important;
      padding: 10px 20px !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      text-transform: none !important;
      letter-spacing: 0 !important;
    }

    button[mat-raised-button]:hover {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
    }

    button[mat-raised-button] mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: white !important;
    }

    .livros-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto 32px;
      padding: 0 24px;
    }

    .livros-titulo {
      font-size: 32px;
      font-weight: 600;
      color: #262626;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .btn-novo-livro {
      background: linear-gradient(135deg, #0078D4 0%, #0063B1 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-novo-livro:hover {
      background: linear-gradient(135deg, #106EBE 0%, #005A9E 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 120, 212, 0.4);
    }

    .btn-novo-livro mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 24px;
    }

    .loading-text {
      font-size: 16px;
      color: #605E5C;
      font-weight: 500;
    }

    .livros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      align-items: stretch;
    }

    .livro-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 500px;
    }

    .livro-card:hover {
      box-shadow: 0 8px 24px rgba(0, 120, 212, 0.15);
      transform: translateY(-4px);
    }

    .livro-capa-container {
      width: 100%;
      height: 320px;
      min-height: 320px;
      max-height: 320px;
      overflow: hidden;
      background: #f0f0f0;
      position: relative;
      flex-shrink: 0;
    }

    .livro-capa {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.3s ease;
    }

    .livro-card:hover .livro-capa {
      transform: scale(1.05);
    }

    .livro-capa-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .livro-capa-placeholder::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 70%
      );
      animation: shimmer 4s infinite ease-in-out;
    }

    .placeholder-icon {
      font-size: 80px;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
      z-index: 1;
      animation: float 3s ease-in-out infinite;
    }

    .placeholder-genero {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.95;
      z-index: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    @keyframes shimmer {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.5;
      }
      50% {
        transform: translate(5%, 5%) rotate(3deg);
        opacity: 1;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    .livro-info {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
    }

    .livro-info h3 {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      margin: 0 0 4px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      min-height: 50px;
    }

    .livro-titulo {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      min-height: 50px;
    }

    .livro-autor,
    .livro-genero,
    .livro-ano {
      font-size: 14px;
      color: #605E5C;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .livro-autor {
      color: #0078D4;
      font-weight: 500;
    }

    .info-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    .livro-isbn {
      font-size: 12px;
      color: #999;
      font-family: 'Courier New', monospace;
      margin: 8px 0 0 0;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;
    }

    .livro-acoes {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid #e0e0e0;
      background: #f9f9f9;
      flex-shrink: 0;
      margin-top: auto;
    }

    .livro-acoes .btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .btn-editar {
      background: #2196F3;
      color: white;
    }

    .btn-editar:hover {
      background: #1976D2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }

    .btn-upload {
      background: #4CAF50;
      color: white;
    }

    .btn-upload:hover {
      background: #388E3C;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }

    .btn-deletar {
      background: #f44336;
      color: white;
    }

    .btn-deletar:hover {
      background: #d32f2f;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
    }

    @media (max-width: 768px) {
      .livros-container {
        padding: 24px 12px;
      }

      .livros-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
        padding: 0 12px;
      }

      .livros-titulo {
        font-size: 24px;
      }

      .btn-novo-livro {
        width: 100%;
        justify-content: center;
      }

      .livros-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
        padding: 0 12px;
      }

      .livro-capa-container {
        height: 280px;
        min-height: 280px;
        max-height: 280px;
      }
    }

    @media (max-width: 480px) {
      .livros-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LivroListComponent implements OnInit {
  listaLivros: Livro[] = [];
  livrosFiltrados: Livro[] = [];
  livros: Livro[] = [];
  carregando = false;
  generoIdFiltro: string | null = null;
  generoNomeFiltro: string | null = null;
  autorIdFiltro: string | null = null;
  autorNomeFiltro: string | null = null;

  constructor(
    private livroService: LivroService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 QUERY PARAMS:', params);
      this.generoIdFiltro = params['generoId'] || null;
      this.generoNomeFiltro = params['generoNome'] || null;
      this.autorIdFiltro = params['autorId'] || null;
      this.autorNomeFiltro = params['autorNome'] || null;
      console.log('🔍 Filtro Gênero:', this.generoIdFiltro, this.generoNomeFiltro);
      console.log('🔍 Filtro Autor:', this.autorIdFiltro, this.autorNomeFiltro);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.carregarDados();
    });
  }

  carregarDados(): void {
    this.carregando = true;
    
    this.livroService.getAll().subscribe({
      next: (dados: Livro[]) => {
        this.listaLivros = dados;
        this.livros = dados;
        console.log('📚 Total de livros:', dados.length);
        this.aplicarFiltro();
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('❌ Erro:', erro);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 APLICANDO FILTRO');
    console.log('generoIdFiltro:', this.generoIdFiltro);
    console.log('autorIdFiltro:', this.autorIdFiltro);
    console.log('Total de livros:', this.listaLivros.length);
    
    if (this.generoIdFiltro) {
      this.livrosFiltrados = this.listaLivros.filter(
        livro => livro.generoId === this.generoIdFiltro
      );
      console.log('✅ FILTRADOS POR GÊNERO:', this.livrosFiltrados.length, 'livros');
      console.log('Títulos filtrados:', this.livrosFiltrados.map(l => l.titulo));
    } else if (this.autorIdFiltro) {
      this.livrosFiltrados = this.listaLivros.filter(
        livro => livro.autorId === this.autorIdFiltro
      );
      console.log('✅ FILTRADOS POR AUTOR:', this.livrosFiltrados.length, 'livros');
      console.log('Títulos filtrados:', this.livrosFiltrados.map(l => l.titulo));
    } else {
      this.livrosFiltrados = this.listaLivros;
      console.log('⚪ SEM FILTRO - mostrando todos');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  limparFiltro(): void {
    this.generoIdFiltro = null;
    this.generoNomeFiltro = null;
    this.autorIdFiltro = null;
    this.autorNomeFiltro = null;
    this.router.navigate(['/livros']);
  }

  editarLivro(livro: Livro): void {
    const dialogRef = this.dialog.open(LivroFormComponent, {
      width: '500px',
      data: livro
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarDados();
      }
    });
  }

  deletarLivro(id: string): void {
    if (confirm('Deseja realmente deletar este livro?')) {
      this.livroService.delete(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao deletar livro:', error);
          alert('Erro ao deletar livro!');
        }
      });
    }
  }

  uploadCapa(livro: Livro): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.livroService.uploadCapa(livro.id, file).subscribe({
          next: () => {
            this.carregarDados();
          },
          error: (error) => {
            console.error('Erro ao fazer upload:', error);
            alert('Erro ao fazer upload da capa!');
          }
        });
      }
    };
    input.click();
  }

  /**
   * Retorna o gradiente de cor baseado no gênero do livro
   */
  getPlaceholderColorByGenero(genero: string): string {
    const generoColors: { [key: string]: string } = {
      'Romance': 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)',
      'Fantasia': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Suspense': 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      'Autoajuda': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Juvenil': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Não-ficção': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Literatura Brasileira': 'linear-gradient(135deg, #30cfd0 0%, #1d976c 100%)',
      'Ficção Científica': 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)',
      'Terror': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      'Biografia': 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
      'Poesia': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'História': 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
      'Aventura': 'linear-gradient(135deg, #16a085 0%, #117a65 100%)',
    };

    return generoColors[genero] || 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
  }

  /**
   * Retorna o ícone emoji baseado no gênero do livro
   */
  getPlaceholderIconByGenero(genero: string): string {
    const generoIcons: { [key: string]: string } = {
      'Romance': '💕',
      'Fantasia': '🔮',
      'Suspense': '🔍',
      'Autoajuda': '🌟',
      'Juvenil': '🎓',
      'Não-ficção': '📖',
      'Literatura Brasileira': '🇧🇷',
      'Ficção Científica': '🚀',
      'Terror': '👻',
      'Biografia': '👤',
      'Poesia': '🌸',
      'História': '📜',
      'Aventura': '⚔️',
    };

    return generoIcons[genero] || '📚';
  }
}
