# Documentação do Frontend

## Visão Geral

Frontend desenvolvido em Angular 18 com arquitetura modular, utilizando standalone components e Angular Material com paleta Azure.

## Estrutura de Pastas

```
frontend/src/app/
├── core/
│   ├── models/
│   │   ├── genero.model.ts
│   │   ├── autor.model.ts
│   │   ├── livro.model.ts
│   │   └── auth.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── genero.service.ts
│   │   ├── autor.service.ts
│   │   ├── livro.service.ts
│   │   └── file-upload.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── auth.interceptor.ts
├── shared/
│   └── components/
│       └── upload-capa/
│           └── upload-capa.component.ts
├── features/
│   ├── auth/
│   │   └── login/
│   ├── generos/
│   │   ├── genero-list/
│   │   └── genero-form/
│   ├── autores/
│   │   ├── autor-list/
│   │   └── autor-form/
│   └── livros/
│       ├── livro-list/
│       └── livro-form/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## Models

### Genero
```typescript
export interface Genero {
  id: string;
  nome: string;
  descricao?: string;
}

export interface GeneroDto {
  id?: string;
  nome: string;
  descricao?: string;
}
```

### Autor
```typescript
export interface Autor {
  id: string;
  nome: string;
  biografia?: string;
  dataNascimento?: Date;
}
```

### Livro
```typescript
export interface Livro {
  id: string;
  titulo: string;
  isbn: string;
  anoPublicacao: number;
  sinopse?: string;
  capaUrl?: string;
  autorId: string;
  autorNome: string;
  generoId: string;
  generoNome: string;
}
```

## Services

### AuthService

**Responsabilidade:** Autenticação e gerenciamento de token.

**Métodos:**
```typescript
login(credentials: LoginRequest): Observable<TokenResponse>
logout(): void
isAuthenticated(): boolean
getToken(): string | null
```

**Estado:**
```typescript
token$: Observable<string | null>
```

**Armazenamento:** localStorage

### GeneroService

**Responsabilidade:** CRUD de gêneros.

**Métodos:**
```typescript
getAll(): Observable<Genero[]>
getById(id: string): Observable<Genero>
create(genero: GeneroDto): Observable<Genero>
update(id: string, genero: GeneroDto): Observable<Genero>
delete(id: string): Observable<void>
```

**Estado:**
```typescript
generos$: Observable<Genero[]>
```

### LivroService

**Responsabilidade:** CRUD de livros + upload de capa.

**Métodos adicionais:**
```typescript
uploadCapa(id: string, file: File): Observable<{ capaUrl: string }>
removerCapa(id: string): Observable<void>
```

### FileUploadService

**Responsabilidade:** Validação e preview de arquivos.

**Métodos:**
```typescript
validateFile(file: File): { valid: boolean; error?: string }
getFilePreview(file: File): Promise<string>
```

**Validações:**
- Extensões: jpg, jpeg, png
- Tamanho: máximo 5MB

## Guards

### AuthGuard

**Responsabilidade:** Proteger rotas autenticadas.

**Implementação:**
```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

**Uso:**
```typescript
{
  path: 'livros',
  canActivate: [authGuard],
  loadComponent: () => import('...')
}
```

## Interceptors

### AuthInterceptor

**Responsabilidade:** Adicionar JWT em todas as requisições.

**Implementação:**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
```

**Configuração:**
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

## Componentes

### LoginComponent

**Responsabilidade:** Autenticação do usuário.

**Features:**
- Formulário reativo
- Validação de campos
- Loading state
- Mensagens de erro
- Redirecionamento após login

### LivroListComponent

**Responsabilidade:** Listagem de livros.

**Features:**
- Grid de cards com capas
- Botões de ação (editar, excluir, alterar capa)
- Loading state
- Fallback para imagens quebradas
- Dialog para formulário
- Dialog para upload

### LivroFormComponent

**Responsabilidade:** Criar/editar livro.

**Features:**
- Formulário reativo
- Seleção de autor e gênero
- Validações
- Campo opcional para URL de capa

### UploadCapaComponent

**Responsabilidade:** Upload de capa do livro.

**Features:**
- Drag and drop
- Seleção de arquivo
- Preview da imagem
- Validação de arquivo
- Progress bar
- Botão para remover capa
- Mensagens de erro

**Implementação:**
```typescript
onDrop(event: DragEvent): void {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.processFile(files[0]);
  }
}

processFile(file: File): void {
  const validation = this.fileUploadService.validateFile(file);
  if (!validation.valid) {
    this.errorMessage = validation.error || '';
    return;
  }

  this.selectedFile = file;
  this.fileUploadService.getFilePreview(file).then(preview => {
    this.previewUrl = preview;
  });
}

upload(): void {
  if (!this.selectedFile) return;

  this.uploading = true;
  this.livroService.uploadCapa(this.data.id, this.selectedFile).subscribe({
    next: () => this.dialogRef.close(true),
    error: (error) => this.errorMessage = error.error?.message
  });
}
```

## Rotas

### Configuração

```typescript
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
  },
  {
    path: 'generos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/generos/genero-list/genero-list.component')
  },
  {
    path: 'autores',
    canActivate: [authGuard],
    loadComponent: () => import('./features/autores/autor-list/autor-list.component')
  },
  {
    path: 'livros',
    canActivate: [authGuard],
    loadComponent: () => import('./features/livros/livro-list/livro-list.component')
  },
  {
    path: '',
    redirectTo: '/livros',
    pathMatch: 'full'
  }
];
```

### Lazy Loading

Todos os componentes são carregados sob demanda usando `loadComponent`.

## Gerenciamento de Estado

### BehaviorSubject Pattern

**Exemplo:**
```typescript
private livrosSubject = new BehaviorSubject<Livro[]>([]);
public livros$ = this.livrosSubject.asObservable();

getAll(): Observable<Livro[]> {
  return this.http.get<Livro[]>(this.apiUrl).pipe(
    tap(livros => this.livrosSubject.next(livros))
  );
}
```

**Consumo:**
```typescript
ngOnInit(): void {
  this.livroService.livros$.subscribe(livros => {
    this.livros = livros;
  });
  this.livroService.getAll().subscribe();
}
```

## Estilos

### Paleta Azure

```scss
$primary: #0078D4;
$accent: #50E6FF;
$background: #F5F5F5;
$text: #323130;
$success: #107C10;
$error: #D13438;
```

### Angular Material

**Tema:** Azure Blue (pré-configurado)

**Componentes usados:**
- MatToolbar
- MatButton
- MatIcon
- MatFormField
- MatInput
- MatSelect
- MatTable
- MatCard
- MatDialog
- MatProgressSpinner
- MatProgressBar
- MatDatepicker

### Estilos Globais

**Localização:** `src/styles.scss`

**Classes utilitárias:**
- `.container`: Container centralizado
- `.card`: Card com sombra
- `.btn-primary`, `.btn-secondary`, `.btn-danger`: Botões
- `.form-group`, `.form-control`: Formulários
- `.grid`: Grid responsivo
- `.book-card`: Card de livro

## Formulários Reativos

### Exemplo

```typescript
this.form = this.fb.group({
  titulo: ['', Validators.required],
  isbn: ['', Validators.required],
  anoPublicacao: ['', [Validators.required, Validators.min(1000)]],
  autorId: ['', Validators.required],
  generoId: ['', Validators.required],
  capaUrl: [''],
  sinopse: ['']
});
```

### Validação

```html
<mat-form-field appearance="outline">
  <mat-label>Título</mat-label>
  <input matInput formControlName="titulo">
  <mat-error *ngIf="form.get('titulo')?.hasError('required')">
    Título é obrigatório
  </mat-error>
</mat-form-field>
```

## Dialogs

### Abertura

```typescript
const dialogRef = this.dialog.open(LivroFormComponent, {
  width: '600px',
  data: livro
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    this.loadData();
  }
});
```

### Fechamento

```typescript
this.dialogRef.close(true);
```

## Environments

### Development

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

### Production

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

## Build

### Development

```bash
npm start
```

### Production

```bash
npm run build -- --configuration production
```

**Output:** `dist/biblioteca-app/browser/`

## Testes

### Estrutura

Testes ao lado dos componentes:
- `*.component.spec.ts`
- `*.service.spec.ts`

### Executar

```bash
npm test
```

### Tecnologias

- Karma
- Jasmine

## Adicionar Nova Feature

1. **Model**: Criar interface em `core/models/`
2. **Service**: Criar service em `core/services/`
3. **Components**: Criar list e form em `features/`
4. **Routes**: Adicionar rota em `app.routes.ts`
5. **Navigation**: Adicionar link no toolbar

## Boas Práticas

### Standalone Components

Todos os componentes são standalone (Angular 18).

### Reactive Programming

Uso extensivo de Observables e RxJS.

### Type Safety

TypeScript strict mode habilitado.

### Lazy Loading

Carregamento sob demanda de rotas.

### Unsubscribe

Uso de `async` pipe ou unsubscribe em `ngOnDestroy`.

## Troubleshooting

### Erro de CORS

Verificar configuração de CORS no backend.

### Erro 401

Verificar se token está sendo enviado corretamente.

### Imagem não carrega

Verificar URL da imagem e configuração de static files no backend.

### Erro de build

Executar `npm install` e verificar versões do Angular.
