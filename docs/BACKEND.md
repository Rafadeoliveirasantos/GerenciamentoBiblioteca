# Documentação do Backend

## Visão Geral

Backend desenvolvido em .NET 8 seguindo arquitetura DDD (Domain-Driven Design) com 4 camadas bem definidas.

## Estrutura de Pastas

```
backend/
├── src/
│   ├── Domain/
│   │   ├── Entities/
│   │   │   ├── Genero.cs
│   │   │   ├── Autor.cs
│   │   │   └── Livro.cs
│   │   └── Interfaces/
│   │       ├── IGeneroRepository.cs
│   │       ├── IAutorRepository.cs
│   │       ├── ILivroRepository.cs
│   │       └── IFileService.cs
│   ├── Application/
│   │   ├── DTOs/
│   │   ├── ViewModels/
│   │   ├── Services/
│   │   └── Validators/
│   ├── Infrastructure/
│   │   ├── Data/
│   │   │   ├── BibliotecaDbContext.cs
│   │   │   └── DbInitializer.cs
│   │   ├── Repositories/
│   │   └── Services/
│   │       └── FileService.cs
│   └── API/
│       ├── Controllers/
│       ├── Program.cs
│       └── appsettings.json
└── tests/
    └── Application.Tests/
```

## Entidades e Relacionamentos

### Genero
```csharp
public class Genero
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string? Descricao { get; set; }
    public ICollection<Livro> Livros { get; set; }
}
```

### Autor
```csharp
public class Autor
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string? Biografia { get; set; }
    public DateTime? DataNascimento { get; set; }
    public ICollection<Livro> Livros { get; set; }
}
```

### Livro
```csharp
public class Livro
{
    public Guid Id { get; set; }
    public string Titulo { get; set; }
    public string ISBN { get; set; }
    public int AnoPublicacao { get; set; }
    public string? Sinopse { get; set; }
    public string? CapaUrl { get; set; }
    public Guid AutorId { get; set; }
    public Guid GeneroId { get; set; }
    public Autor Autor { get; set; }
    public Genero Genero { get; set; }
}
```

**Relacionamentos:**
- Genero 1:N Livro
- Autor 1:N Livro
- DeleteBehavior: Restrict (evita exclusão em cascata)

## Endpoints da API

### Autenticação

#### POST /api/v1/auth/login
Autentica usuário e retorna JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-02-12T08:00:00Z"
}
```

**Response (401):**
```json
{
  "message": "Usuário ou senha inválidos"
}
```

### Gêneros

#### GET /api/v1/generos
Lista todos os gêneros.

**Response (200):**
```json
[
  {
    "id": "guid",
    "nome": "Romance",
    "descricao": "Obras de ficção narrativa"
  }
]
```

#### GET /api/v1/generos/{id}
Busca gênero por ID.

**Response (200):** Objeto Genero
**Response (404):** `{ "message": "Gênero não encontrado" }`

#### POST /api/v1/generos
Cria novo gênero.

**Request:**
```json
{
  "nome": "Ficção Científica",
  "descricao": "Literatura de ficção científica"
}
```

**Response (201):** Objeto criado com Location header

#### PUT /api/v1/generos/{id}
Atualiza gênero existente.

#### DELETE /api/v1/generos/{id}
Exclui gênero.

**Response (204):** Sem conteúdo
**Response (404):** Não encontrado

### Autores

Endpoints similares aos de Gêneros:
- GET /api/v1/autores
- GET /api/v1/autores/{id}
- POST /api/v1/autores
- PUT /api/v1/autores/{id}
- DELETE /api/v1/autores/{id}

### Livros

#### GET /api/v1/livros
Lista todos os livros com autor e gênero.

**Response (200):**
```json
[
  {
    "id": "guid",
    "titulo": "Dom Casmurro",
    "isbn": "978-8535911664",
    "anoPublicacao": 1899,
    "sinopse": "...",
    "capaUrl": "https://...",
    "autorId": "guid",
    "autorNome": "Machado de Assis",
    "generoId": "guid",
    "generoNome": "Realismo"
  }
]
```

#### POST /api/v1/livros
Cria novo livro.

**Validações:**
- Autor deve existir
- Gênero deve existir
- ISBN deve ser único

#### POST /api/v1/livros/{id}/capa
Upload de capa do livro.

**Request:** multipart/form-data
- Campo: `arquivo` (IFormFile)

**Validações:**
- Formato: JPG, JPEG, PNG
- Tamanho máximo: 5MB

**Response (200):**
```json
{
  "capaUrl": "/uploads/capas/9788535911664_abc123.jpg"
}
```

**Response (400):**
```json
{
  "message": "Arquivo inválido. Apenas JPG, JPEG e PNG são permitidos (máximo 5MB)"
}
```

#### DELETE /api/v1/livros/{id}/capa
Remove capa do livro.

**Response (204):** Sem conteúdo
**Response (404):** Livro não encontrado ou sem capa

### Arquivos Estáticos

#### GET /uploads/capas/{filename}
Serve imagem de capa.

**Response (200):** Arquivo de imagem
**Response (404):** Arquivo não encontrado

## FileService

### Interface
```csharp
public interface IFileService
{
    Task<string> SalvarCapaAsync(IFormFile arquivo, string isbn);
    Task DeletarCapaAsync(string caminhoArquivo);
    bool ValidarArquivo(IFormFile arquivo);
}
```

### Implementação

**Diretório de upload:** `/uploads/capas/`

**Nomenclatura:** `{ISBN sem hífen}_{GUID}.{extensão}`

**Validações:**
- Extensões permitidas: .jpg, .jpeg, .png
- Tamanho máximo: 5MB (5 * 1024 * 1024 bytes)

**Fluxo de upload:**
1. Validar arquivo
2. Gerar nome único
3. Salvar no disco
4. Retornar caminho relativo
5. Atualizar entidade Livro

**Fluxo de exclusão:**
1. Verificar se arquivo existe
2. Deletar do disco
3. Atualizar entidade Livro (CapaUrl = null)

## Autenticação JWT

### Configuração

**Chave:** Definida em `appsettings.json`
**Algoritmo:** HMAC-SHA256
**Expiração:** 8 horas

### Claims
- `userId`: "1"
- `username`: Nome do usuário

### Uso
Adicionar header em todas as requisições protegidas:
```
Authorization: Bearer {token}
```

## Validações

### FluentValidation

**GeneroDto:**
- Nome: obrigatório, máx 100 caracteres
- Descrição: máx 500 caracteres

**AutorDto:**
- Nome: obrigatório, máx 200 caracteres
- Biografia: máx 2000 caracteres
- DataNascimento: deve ser no passado

**LivroDto:**
- Titulo: obrigatório, máx 300 caracteres
- ISBN: obrigatório, máx 20 caracteres
- AnoPublicacao: > 1000, <= ano atual
- Sinopse: máx 5000 caracteres
- AutorId: obrigatório
- GeneroId: obrigatório

## Seed Data

### DbInitializer

Executado automaticamente na inicialização da aplicação.

**Conteúdo:**
- 5 gêneros
- 12 autores
- 20 livros brasileiros clássicos

**Livros incluem:**
- Dados completos (título, ISBN, ano, sinopse)
- URLs de capas reais
- Relacionamentos com autores e gêneros

## Migrations

### Criar Migration
```bash
cd backend/src/API
dotnet ef migrations add NomeDaMigration
```

### Aplicar Migration
```bash
dotnet ef database update
```

### Remover última Migration
```bash
dotnet ef migrations remove
```

## Testes

### Estrutura
```
tests/
└── Application.Tests/
    └── Services/
        ├── GeneroServiceTests.cs
        ├── LivroServiceTests.cs
        └── ...
```

### Executar
```bash
cd backend/tests/Application.Tests
dotnet test
```

### Tecnologias
- xUnit
- Moq (mocking)

### Exemplos

**Teste de criação:**
```csharp
[Fact]
public async Task CreateAsync_CreatesGenero()
{
    var dto = new GeneroDto { Nome = "Terror" };
    var result = await _service.CreateAsync(dto);
    Assert.Equal(dto.Nome, result.Nome);
}
```

**Teste de validação:**
```csharp
[Fact]
public async Task CreateAsync_ThrowsException_WhenAutorNotExists()
{
    await Assert.ThrowsAsync<InvalidOperationException>(
        () => _service.CreateAsync(dto)
    );
}
```

## Configuração

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BibliotecaDB;..."
  },
  "Jwt": {
    "Key": "ChaveSecretaSuperSegura..."
  }
}
```

### Program.cs

**Serviços configurados:**
- DbContext (SQL Server)
- Repositories (Scoped)
- Services (Scoped)
- FluentValidation
- JWT Authentication
- CORS
- Swagger
- Static Files

## Boas Práticas

### Async/Await
Todas as operações I/O são assíncronas.

### Injeção de Dependências
Uso extensivo de DI para desacoplamento.

### Repository Pattern
Abstração do acesso a dados.

### DTO Pattern
Separação entre entidades e objetos de transferência.

### SOLID
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

## Adicionar Nova Feature

1. **Domain**: Criar entidade e interface de repositório
2. **Application**: Criar DTO, ViewModel, Service e Validator
3. **Infrastructure**: Implementar repositório e configurar DbContext
4. **API**: Criar controller
5. **Migration**: Criar e aplicar migration
6. **Testes**: Criar testes unitários

## Troubleshooting

### Erro de conexão com SQL Server
Verificar connection string e se SQL Server está rodando.

### Erro de migration
Executar `dotnet ef database update` manualmente.

### Erro de upload
Verificar permissões da pasta `/uploads/capas/`.

### Erro de autenticação
Verificar se token está sendo enviado no header.
