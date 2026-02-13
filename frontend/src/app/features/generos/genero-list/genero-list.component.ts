import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GeneroService } from '../../../core/services/genero.service';
import { Genero } from '../../../core/models/genero.model';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="generos-container">
      <div class="header">
        <h1>🏷️ Gêneros Literários</h1>
        <p class="subtitle">Explore nossa coleção por categoria</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando gêneros...</p>
      </div>

      <div *ngIf="!loading" class="generos-grid">
        <div class="genero-card" 
             *ngFor="let genero of generos"
             (click)="verLivrosDoGenero(genero)">
          <div class="genero-icon">{{ getIcon(genero.nome) }}</div>
          <h3>{{ genero.nome }}</h3>
          <p class="descricao" *ngIf="genero.descricao">{{ genero.descricao }}</p>
          <div class="genero-shine"></div>
        </div>
      </div>

      <div *ngIf="!loading && generos.length === 0" class="empty-state">
        <p>📚 Nenhum gênero cadastrado</p>
      </div>
    </div>
  `,
  styles: [`
    .generos-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
      color: white;
    }

    .header h1 {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 12px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .subtitle {
      font-size: 18px;
      opacity: 0.95;
    }

    .loading {
      text-align: center;
      padding: 80px 20px;
      color: white;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .loading p {
      font-size: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .generos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .genero-card {
      background: white;
      border-radius: 20px;
      padding: 48px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .genero-card:hover {
      transform: translateY(-12px) scale(1.05);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .genero-card:hover .genero-icon {
      transform: scale(1.2) rotate(10deg);
    }

    .genero-card:hover .genero-shine {
      opacity: 1;
    }

    .genero-icon {
      font-size: 72px;
      margin-bottom: 20px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;
    }

    .genero-card h3 {
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .descricao {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    .genero-shine {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      opacity: 0;
      transition: opacity 0.4s;
    }

    .empty-state {
      text-align: center;
      padding: 100px 20px;
      font-size: 20px;
      color: white;
    }
  `]
})
export class GeneroListComponent implements OnInit {
  generos: Genero[] = [];
  loading = true;

  generoIcons: { [key: string]: string } = {
    'Romance': '💕',
    'Suspense': '🔍',
    'Juvenil': '🎒',
    'Literatura Brasileira': '🇧🇷',
    'Fantasia': '🐉',
    'Autoajuda': '💪',
    'Não-ficção': '📖'
  };

  constructor(
    private generoService: GeneroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarGeneros();
  }

  carregarGeneros(): void {
    this.loading = true;
    this.generoService.getAll().subscribe({
      next: (generos) => {
        this.generos = generos;
        this.loading = false;
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ GÊNEROS CARREGADOS DO BACKEND:');
        console.log('   Total:', generos.length);
        console.log('   Dados:', generos);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar gêneros:', erro);
        this.loading = false;
      }
    });
  }

  getIcon(generoNome: string): string {
    return this.generoIcons[generoNome] || '📚';
  }

  verLivrosDoGenero(genero: Genero): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🖱️ CLIQUE NO GÊNERO DETECTADO!');
    console.log('📌 Gênero:', genero.nome);
    console.log('🆔 ID:', genero.id);
    console.log('🔗 Tipo do ID:', typeof genero.id);
    console.log('📦 Objeto completo:', genero);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    this.router.navigate(['/livros'], {
      queryParams: {
        generoId: genero.id,
        generoNome: genero.nome
      }
    }).then(success => {
      if (success) {
        console.log('✅ Navegação bem-sucedida para /livros');
        console.log('🔗 URL esperada: /livros?generoId=' + genero.id + '&generoNome=' + genero.nome);
      } else {
        console.error('❌ Falha na navegação!');
      }
    });
  }
}
