# Sistema de Gerenciamento de Biblioteca

Sistema completo de gerenciamento de biblioteca desenvolvido com .NET 8 (backend) e Angular 18 (frontend), incluindo funcionalidade de upload de capas de livros.

## 🚀 Tecnologias

### Backend
- .NET 8
- Entity Framework Core
- SQL Server 2022
- JWT Authentication
- Swagger/OpenAPI
- FluentValidation
- xUnit + Moq

### Frontend
- Angular 18
- TypeScript
- RxJS
- Angular Material (paleta Azure)
- Jasmine/Karma

### DevOps
- Docker
- Docker Compose
- Nginx

## 📋 Funcionalidades

- **Gerenciamento de Gêneros**: CRUD completo
- **Gerenciamento de Autores**: CRUD completo com data de nascimento e biografia
- **Gerenciamento de Livros**: CRUD completo com relacionamentos
- **Upload de Capas**: Upload, visualização e remoção de imagens de capa
- **Autenticação JWT**: Login seguro com token de 8 horas
- **Seed Data**: 20 best-sellers modernos pré-cadastrados com capas

## 🎯 Regras de Negócio

- Um gênero pode ter N livros
- Um autor pode ter N livros
- Cada livro pertence a apenas um autor e um gênero
- Livro pode ter capa (URL externa OU upload local)
- Upload de capa substitui a anterior (se existir)
- Formatos aceitos: JPG, JPEG, PNG (máximo 5MB)

## 🐳 Executar com Docker (RECOMENDADO)

```bash
# Clonar o repositório
git clone https://github.com/Rafadeoliveirasantos/GerenciamentoBiblioteca.git
cd GerenciamentoBiblioteca

# Executar todos os serviços
docker-compose up

# Aguardar inicialização (migrations automáticas + seed)
```

**Acessar:**
- Frontend: http://localhost:4200
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

**Credenciais:**
- Usuário: `admin`
- Senha: `Admin@123`

## 💻 Executar Localmente

### Backend

```bash
cd backend/src/API

# Restaurar dependências
dotnet restore

# Executar migrations
dotnet ef database update

# Executar
dotnet run
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login

### Gêneros
- `GET /api/v1/generos` - Listar todos
- `GET /api/v1/generos/{id}` - Buscar por ID
- `POST /api/v1/generos` - Criar
- `PUT /api/v1/generos/{id}` - Atualizar
- `DELETE /api/v1/generos/{id}` - Excluir

### Autores
- `GET /api/v1/autores` - Listar todos
- `GET /api/v1/autores/{id}` - Buscar por ID
- `POST /api/v1/autores` - Criar
- `PUT /api/v1/autores/{id}` - Atualizar
- `DELETE /api/v1/autores/{id}` - Excluir

### Livros
- `GET /api/v1/livros` - Listar todos
- `GET /api/v1/livros/{id}` - Buscar por ID
- `POST /api/v1/livros` - Criar
- `PUT /api/v1/livros/{id}` - Atualizar
- `DELETE /api/v1/livros/{id}` - Excluir
- `POST /api/v1/livros/{id}/capa` - Upload de capa (multipart/form-data)
- `DELETE /api/v1/livros/{id}/capa` - Remover capa

### Arquivos Estáticos
- `GET /uploads/capas/{filename}` - Servir imagem de capa

## 📖 Livros Pré-cadastrados

O sistema vem com 20 best-sellers modernos pré-cadastrados automaticamente (seed):

1. A Culpa é das Estrelas - John Green (Romance)
2. É Assim Que Acaba - Colleen Hoover (Romance)
3. Verity - Colleen Hoover (Suspense)
4. Extraordinário - R.J. Palacio (Juvenil)
5. Torto Arado - Itamar Vieira Junior (Literatura Brasileira)
6. A Paciente Silenciosa - Alex Michaelides (Suspense)
7. Para Todos os Garotos Que Já Amei - Jenny Han (Juvenil)
8. O Lado Bom da Vida - Matthew Quick (Romance)
9. A Seleção - Kiera Cass (Fantasia)
10. Bom Dia, Verônica - Raphael Montes (Suspense)
11. O Milagre da Manhã - Hal Elrod (Autoajuda)
12. Pequeno Manual Antirracista - Djamila Ribeiro (Não-ficção)
13. Teto Para Dois - Beth O'Leary (Romance)
14. A Garota do Lago - Charlie Donlea (Suspense)
15. Ideias Para Adiar o Fim do Mundo - Ailton Krenak (Não-ficção)
16. November 9 - Colleen Hoover (Romance)
17. Quem Me Roubou de Mim? - Padre Fábio de Melo (Autoajuda)
18. Mindset: A Nova Psicologia do Sucesso - Carol S. Dweck (Não-ficção)
19. Fazendo Meu Filme 1 - Paula Pimenta (Juvenil)
20. Ansiedade: Como Enfrentar o Mal do Século - Augusto Cury (Autoajuda)

Todos com capas reais via Google Books (URLs externas).

## 🧪 Como Usar

1. Fazer login com `admin` / `Admin@123`
2. Navegar para "Livros", "Autores" ou "Gêneros"
3. Para **criar**: clicar no botão "➕ Novo Livro" (ou equivalente)
4. Para **editar**: clicar no botão "✏️ Editar" no card do livro
5. Para **upload de capa**: clicar no botão "📷 Foto" e selecionar uma imagem
6. Para **deletar**: clicar no botão "🗑️ Deletar" e confirmar

## 🧪 Executar Testes

### Backend
```bash
cd backend/tests/Application.Tests

# Executar testes
dotnet test

# Com cobertura
dotnet test --collect:"XPlat Code Coverage"
```

**Cobertura Atual:**
- ✅ **27 testes** - 100% passando
- ✅ **65.4%** de cobertura de linhas
- ✅ **60.9%** de cobertura de branches  
- ✅ **74.3%** de cobertura de métodos

### Frontend
```bash
cd frontend

# Executar testes
npm test
```

**Cobertura Atual:**
- ✅ **27 testes** - 100% passando
- ✅ Todos os serviços cobertos

## 📁 Estrutura do Projeto

```
GerenciamentoBiblioteca/
├── backend/
│   ├── src/
│   │   ├── Domain/          # Entidades, Interfaces
│   │   ├── Application/     # DTOs, Services, Validators
│   │   ├── Infrastructure/  # EF Core, Repositories, FileService
│   │   └── API/            # Controllers, Middleware
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/       # Services, Guards, Interceptors
│   │       ├── shared/     # Componentes reutilizáveis
│   │       └── features/   # Módulos de funcionalidades
│   ├── nginx.conf
│   └── Dockerfile
├── uploads/
│   └── capas/
├── docs/
├── docker-compose.yml
└── README.md
```

## 🏗️ Arquitetura

**DDD (Domain-Driven Design)** com separação de responsabilidades:

- **Domain:** Entidades e lógica de negócio pura
- **Application:** Use cases, DTOs, validações
- **Infrastructure:** Persistência, serviços externos
- **API:** Controllers, autenticação, middlewares

## 🔒 Segurança

- JWT com expiração de 8 horas
- CORS configurado
- Validação de arquivos (tipo e tamanho)
- SQL Injection prevention via LINQ
- Senhas não armazenadas (demo apenas)

## 🎨 Design

Interface moderna com paleta Azure:
- Primary: #0078D4
- Accent: #50E6FF
- Background: #FFFFFF, #F5F5F5
- Success: #107C10
- Error: #D13438

## 📝 Licença

Este projeto é um exemplo educacional.

## 👤 Autor

Rafael de Oliveira Santos  
https://github.com/Rafadeoliveirasantos

---

**Projeto desenvolvido para o desafio técnico Siemens**  
**Data de entrega:** 13/02/2026
