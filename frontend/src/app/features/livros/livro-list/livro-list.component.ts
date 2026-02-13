import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LivroService } from '../../../core/services/livro.service';
import { Livro } from '../../../core/models/livro.model';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './livro-list.component.html',
  styles: [`
    .livros-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
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
    }

    .livro-card:hover {
      box-shadow: 0 8px 24px rgba(0, 120, 212, 0.15);
      transform: translateY(-4px);
    }

    .livro-capa-container {
      width: 100%;
      height: 360px;
      overflow: hidden;
      background: #f0f0f0;
      position: relative;
    }

    .livro-capa {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .livro-card:hover .livro-capa {
      transform: scale(1.05);
    }

    .livro-capa-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0078D4 0%, #0063B1 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      text-align: center;
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
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .book-icon {
      width: 80px;
      height: 80px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      z-index: 1;
    }

    .placeholder-titulo {
      font-size: 18px;
      font-weight: 600;
      color: white;
      line-height: 1.4;
      max-width: 100%;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .livro-info {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
      line-height: 1.4;
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
      padding: 12px 16px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      gap: 4px;
      justify-content: flex-end;
      background: #fafafa;
    }

    .btn-acao {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .btn-capa {
      color: #0078D4;
    }

    .btn-capa:hover {
      background: rgba(0, 120, 212, 0.1);
    }

    .btn-editar {
      color: #666;
    }

    .btn-editar:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #333;
    }

    .btn-excluir {
      color: #d13438;
    }

    .btn-excluir:hover {
      background: rgba(209, 52, 56, 0.1);
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
        height: 300px;
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

  constructor(
    private livroService: LivroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 QUERY PARAMS:', params);
      this.generoIdFiltro = params['generoId'] || null;
      this.generoNomeFiltro = params['generoNome'] || null;
      console.log('🔍 Filtro:', this.generoIdFiltro, this.generoNomeFiltro);
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
    console.log('Total de livros:', this.listaLivros.length);
    
    if (this.generoIdFiltro) {
      this.livrosFiltrados = this.listaLivros.filter(
        livro => livro.generoId === this.generoIdFiltro
      );
      console.log('✅ FILTRADOS:', this.livrosFiltrados.length, 'livros');
      console.log('Títulos filtrados:', this.livrosFiltrados.map(l => l.titulo));
    } else {
      this.livrosFiltrados = this.listaLivros;
      console.log('⚪ SEM FILTRO - mostrando todos');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  limparFiltro(): void {
    this.router.navigate(['/livros']);
  }

  getPlaceholderColor(index: number): string {
    const cores = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return cores[index % cores.length];
  }
}
