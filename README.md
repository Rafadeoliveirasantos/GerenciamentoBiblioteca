# Sistema de Gerenciamento de Biblioteca

Sistema completo de gerenciamento de biblioteca desenvolvido com .NET 8 (backend) e Angular 18 (frontend), incluindo funcionalidade de upload de capas de livros.

## 🚀 Tecnologias

### Backend
- .NET 8
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger/OpenAPI
- FluentValidation
- xUnit

### Frontend
- Angular 18
- TypeScript
- RxJS
- Angular Material (paleta Azure)
- Karma/Jasmine

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
- **Seed Data**: 20 livros brasileiros clássicos pré-cadastrados

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

O sistema vem com 20 livros brasileiros clássicos:

1. Dom Casmurro - Machado de Assis
2. Memórias Póstumas de Brás Cubas - Machado de Assis
3. Grande Sertão: Veredas - Guimarães Rosa
4. O Cortiço - Aluísio Azevedo
5. Capitães da Areia - Jorge Amado
6. A Hora da Estrela - Clarice Lispector
7. Vidas Secas - Graciliano Ramos
8. O Quinze - Rachel de Queiroz
9. Macunaíma - Mário de Andrade
10. Iracema - José de Alencar
11. Triste Fim de Policarpo Quaresma - Lima Barreto
12. O Tempo e o Vento - Érico Veríssimo
13. Quincas Borba - Machado de Assis
14. A Paixão Segundo G.H. - Clarice Lispector
15. São Bernardo - Graciliano Ramos
16. Gabriela, Cravo e Canela - Jorge Amado
17. Romanceiro da Inconfidência - Cecília Meireles
18. O Guarani - José de Alencar
19. Sagarana - Guimarães Rosa
20. Memorial de Aires - Machado de Assis

Todos com capas reais de URLs externas.

## 🧪 Testar Upload de Capa

1. Fazer login com `admin` / `Admin@123`
2. Navegar para "Livros"
3. Clicar no ícone de câmera em qualquer livro
4. Arrastar uma imagem ou clicar para selecionar
5. Clicar em "Upload"
6. A capa será atualizada imediatamente

## 🧪 Executar Testes

### Backend
```bash
cd backend/tests/Application.Tests
dotnet test
```

### Frontend
```bash
cd frontend
npm test
```

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
