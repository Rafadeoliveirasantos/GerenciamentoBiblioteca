# Arquitetura do Sistema

## Visão Geral

O sistema segue uma arquitetura em camadas com separação clara de responsabilidades, utilizando DDD (Domain-Driven Design) no backend e arquitetura modular no frontend.

## Backend - DDD (Domain-Driven Design)

### Camadas

#### 1. Domain (Núcleo)
- **Responsabilidade**: Entidades de negócio e contratos
- **Conteúdo**:
  - Entidades: `Genero`, `Autor`, `Livro`
  - Interfaces de repositório: `IGeneroRepository`, `IAutorRepository`, `ILivroRepository`
  - Interface de serviço: `IFileService`
- **Dependências**: Nenhuma
- **Princípio**: Camada mais interna, sem dependências externas

#### 2. Application (Casos de Uso)
- **Responsabilidade**: Lógica de aplicação e orquestração
- **Conteúdo**:
  - DTOs: Objetos de transferência de dados
  - ViewModels: Modelos de resposta
  - Services: Lógica de negócio (`GeneroService`, `AutorService`, `LivroService`, `AuthService`)
  - Validators: Validações com FluentValidation
- **Dependências**: Domain
- **Princípio**: Orquestra o fluxo de dados entre camadas

#### 3. Infrastructure (Implementação)
- **Responsabilidade**: Acesso a dados e serviços externos
- **Conteúdo**:
  - `BibliotecaDbContext`: Contexto do EF Core
  - Repositories: Implementação dos repositórios
  - `FileService`: Gerenciamento de arquivos
  - `DbInitializer`: Seed de dados
  - Migrations
- **Dependências**: Domain
- **Princípio**: Implementa interfaces do Domain

#### 4. API (Apresentação)
- **Responsabilidade**: Exposição de endpoints HTTP
- **Conteúdo**:
  - Controllers: `AuthController`, `GenerosController`, `AutoresController`, `LivrosController`
  - Middleware: Tratamento de erros
  - Configuração: JWT, Swagger, CORS, Static Files
- **Dependências**: Application, Infrastructure
- **Princípio**: Camada mais externa, expõe a API

### Fluxo de Dados

```
Cliente HTTP
    ↓
API Controller
    ↓
Application Service
    ↓
Domain Repository Interface
    ↓
Infrastructure Repository Implementation
    ↓
Database (SQL Server)
```

### Padrões Utilizados

#### Repository Pattern
- Abstração do acesso a dados
- Interfaces no Domain, implementação na Infrastructure
- Facilita testes e manutenção

#### Dependency Injection
- Injeção de dependências via ASP.NET Core DI
- Configuração no `Program.cs`
- Lifetime: Scoped para repositórios e services

#### DTO Pattern
- Separação entre entidades de domínio e objetos de transferência
- DTOs para entrada, ViewModels para saída
- Mapeamento manual para controle total

#### Service Layer
- Lógica de negócio centralizada
- Validações e orquestração
- Reutilização de código

### Gerenciamento de Arquivos

#### FileService
- **Localização**: Infrastructure/Services
- **Responsabilidade**: Upload, validação e exclusão de arquivos
- **Armazenamento**: Sistema de arquivos local (`/uploads/capas/`)
- **Validações**:
  - Formato: JPG, JPEG, PNG
  - Tamanho: Máximo 5MB
- **Nomenclatura**: `{ISBN}_{GUID}.{extensão}`

#### Static Files
- Servidos via middleware ASP.NET Core
- Path: `/uploads/capas/{filename}`
- Configuração em `Program.cs`

### Persistência com Docker Volumes

```yaml
volumes:
  - ./uploads:/app/uploads
```

Garante que uploads persistam entre reinicializações do container.

## Frontend - Angular 18

### Arquitetura Modular

#### Core Module
- **Responsabilidade**: Funcionalidades singleton
- **Conteúdo**:
  - Models: Interfaces TypeScript
  - Services: Comunicação com API
  - Guards: Proteção de rotas
  - Interceptors: Adição de JWT

#### Shared Module
- **Responsabilidade**: Componentes reutilizáveis
- **Conteúdo**:
  - `UploadCapaComponent`: Upload de imagens
  - Componentes genéricos

#### Features Modules
- **Responsabilidade**: Funcionalidades específicas
- **Estrutura**:
  - `auth/`: Login
  - `generos/`: CRUD de gêneros
  - `autores/`: CRUD de autores
  - `livros/`: CRUD de livros + upload

### Fluxo de Dados

```
Componente
    ↓
Service (BehaviorSubject)
    ↓
HTTP Interceptor (adiciona JWT)
    ↓
API Backend
    ↓
Service atualiza BehaviorSubject
    ↓
Componente recebe atualização (Observable)
```

### Gerenciamento de Estado

- **BehaviorSubject**: Estado reativo
- **Observables**: Propagação de mudanças
- **Services**: Centralizados por entidade

### Padrões Utilizados

#### Standalone Components
- Componentes independentes (Angular 18)
- Sem necessidade de módulos
- Imports diretos

#### Reactive Forms
- Validação reativa
- FormBuilder para construção
- Validators do Angular

#### Lazy Loading
- Carregamento sob demanda
- Melhora performance inicial
- Configurado nas rotas

#### Guard Pattern
- `AuthGuard`: Proteção de rotas
- Redirecionamento para login
- Verificação de token

#### Interceptor Pattern
- `AuthInterceptor`: Adiciona JWT
- Automático em todas as requisições
- Configurado no `appConfig`

### Upload de Imagens

#### FileUploadService
- Validação de arquivo
- Preview antes do upload
- Conversão para base64

#### UploadCapaComponent
- Drag and drop
- Seleção de arquivo
- Progress bar
- Preview em tempo real

## Comunicação Backend-Frontend

### REST API
- JSON como formato de dados
- HTTP Status Codes padronizados
- CORS habilitado

### Autenticação
- JWT no header `Authorization: Bearer {token}`
- Token armazenado no localStorage
- Expiração: 8 horas

### Upload de Arquivos
- `multipart/form-data`
- FormData no frontend
- IFormFile no backend

## Docker Architecture

### Serviços

#### SQL Server
- Imagem: `mcr.microsoft.com/mssql/server:2022-latest`
- Porta: 1433
- Volume: `sqldata` (persistência)

#### API (.NET)
- Build multi-stage
- Porta: 5000 → 8080 (container)
- Volume: `./uploads` (persistência de arquivos)

#### Frontend (Angular + Nginx)
- Build multi-stage
- Porta: 4200 → 80 (container)
- Nginx como reverse proxy

### Rede
- Bridge network: `biblioteca-network`
- Comunicação interna entre containers
- Isolamento de rede

### Volumes
- `sqldata`: Dados do SQL Server
- `./uploads`: Arquivos de upload

## Segurança

### Backend
- JWT com chave secreta
- HTTPS recomendado em produção
- Validação de entrada (FluentValidation)
- LINQ (prevenção de SQL Injection)
- Validação de arquivos (tipo e tamanho)

### Frontend
- Guard para rotas protegidas
- Interceptor para JWT
- Validação de formulários
- Sanitização de inputs

## Performance

### Backend
- Async/await em todas operações I/O
- EF Core com Include para eager loading
- Índice único em ISBN

### Frontend
- Lazy loading de rotas
- OnPush change detection (onde aplicável)
- Observables para reatividade
- Otimização de imagens

## Escalabilidade

### Horizontal
- Stateless API (JWT)
- Arquivos em storage externo (S3, Azure Blob)
- Load balancer para múltiplas instâncias

### Vertical
- Connection pooling (EF Core)
- Caching (Redis)
- CDN para arquivos estáticos

## Manutenibilidade

### Código Limpo
- Nomenclatura clara em português
- Sem comentários desnecessários
- SOLID principles
- Separação de responsabilidades

### Testes
- Unitários para Services
- Mocks para repositórios
- Cobertura básica

### Documentação
- Swagger para API
- README completo
- Documentação de arquitetura
