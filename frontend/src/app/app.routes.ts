import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'generos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/generos/genero-list/genero-list.component').then(m => m.GeneroListComponent)
  },
  {
    path: 'autores',
    canActivate: [authGuard],
    loadComponent: () => import('./features/autores/autor-list/autor-list.component').then(m => m.AutorListComponent)
  },
  {
    path: 'livros',
    canActivate: [authGuard],
    loadComponent: () => import('./features/livros/livro-list/livro-list.component').then(m => m.LivroListComponent)
  },
  {
    path: '',
    redirectTo: '/livros',
    pathMatch: 'full'
  }
];
