using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Moq;
using Xunit;

namespace Application.Tests.Services;

public class LivroServiceTests
{
    private readonly Mock<ILivroRepository> _livroRepositoryMock;
    private readonly Mock<IAutorRepository> _autorRepositoryMock;
    private readonly Mock<IGeneroRepository> _generoRepositoryMock;
    private readonly Mock<IFileService> _fileServiceMock;
    private readonly LivroService _service;

    public LivroServiceTests()
    {
        _livroRepositoryMock = new Mock<ILivroRepository>();
        _autorRepositoryMock = new Mock<IAutorRepository>();
        _generoRepositoryMock = new Mock<IGeneroRepository>();
        _fileServiceMock = new Mock<IFileService>();
        _service = new LivroService(
            _livroRepositoryMock.Object,
            _autorRepositoryMock.Object,
            _generoRepositoryMock.Object,
            _fileServiceMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ThrowsException_WhenAutorNotExists()
    {
        var dto = new CriarLivroDto
        {
            Titulo = "Teste",
            ISBN = "123",
            AnoPublicacao = 2020,
            AutorId = Guid.NewGuid(),
            GeneroId = Guid.NewGuid()
        };

        _autorRepositoryMock.Setup(r => r.ExistsAsync(dto.AutorId)).ReturnsAsync(false);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(dto));
    }

    [Fact]
    public async Task CreateAsync_ThrowsException_WhenISBNExists()
    {
        var dto = new CriarLivroDto
        {
            Titulo = "Teste",
            ISBN = "123",
            AnoPublicacao = 2020,
            AutorId = Guid.NewGuid(),
            GeneroId = Guid.NewGuid()
        };

        _autorRepositoryMock.Setup(r => r.ExistsAsync(dto.AutorId)).ReturnsAsync(true);
        _generoRepositoryMock.Setup(r => r.ExistsAsync(dto.GeneroId)).ReturnsAsync(true);
        _livroRepositoryMock.Setup(r => r.ISBNExistsAsync(dto.ISBN, null)).ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(dto));
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllLivros()
    {
        var livros = new List<Livro>
        {
            new Livro { Id = Guid.NewGuid(), Titulo = "Livro 1", ISBN = "111", AutorId = Guid.NewGuid(), GeneroId = Guid.NewGuid() },
            new Livro { Id = Guid.NewGuid(), Titulo = "Livro 2", ISBN = "222", AutorId = Guid.NewGuid(), GeneroId = Guid.NewGuid() }
        };

        _livroRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(livros);

        var result = await _service.GetAllAsync();

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsLivro_WhenExists()
    {
        var id = Guid.NewGuid();
        var livro = new Livro { Id = id, Titulo = "Teste", ISBN = "123", AutorId = Guid.NewGuid(), GeneroId = Guid.NewGuid() };

        _livroRepositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(livro);

        var result = await _service.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal("Teste", result!.Titulo);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _livroRepositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Livro?)null);

        var result = await _service.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_ReturnsLivro_WhenValid()
    {
        var autorId = Guid.NewGuid();
        var generoId = Guid.NewGuid();
        var dto = new CriarLivroDto
        {
            Titulo = "Novo Livro",
            ISBN = "999",
            AnoPublicacao = 2023,
            AutorId = autorId,
            GeneroId = generoId
        };

        _autorRepositoryMock.Setup(r => r.ExistsAsync(autorId)).ReturnsAsync(true);
        _generoRepositoryMock.Setup(r => r.ExistsAsync(generoId)).ReturnsAsync(true);
        _livroRepositoryMock.Setup(r => r.ISBNExistsAsync("999", null)).ReturnsAsync(false);
        _livroRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<Livro>())).ReturnsAsync((Livro l) => l);

        var result = await _service.CreateAsync(dto);

        Assert.Equal("Novo Livro", result.Titulo);
    }

    [Fact]
    public async Task CreateAsync_ThrowsException_WhenGeneroNotExists()
    {
        var dto = new CriarLivroDto
        {
            Titulo = "Teste",
            ISBN = "123",
            AnoPublicacao = 2020,
            AutorId = Guid.NewGuid(),
            GeneroId = Guid.NewGuid()
        };

        _autorRepositoryMock.Setup(r => r.ExistsAsync(dto.AutorId)).ReturnsAsync(true);
        _generoRepositoryMock.Setup(r => r.ExistsAsync(dto.GeneroId)).ReturnsAsync(false);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(dto));
    }

    [Fact]
    public async Task UpdateAsync_ReturnsUpdatedLivro_WhenExists()
    {
        var id = Guid.NewGuid();
        var autorId = Guid.NewGuid();
        var generoId = Guid.NewGuid();
        var livroExistente = new Livro { Id = id, Titulo = "Antigo", ISBN = "111", AutorId = autorId, GeneroId = generoId };
        var dto = new AtualizarLivroDto
        {
            Titulo = "Atualizado",
            ISBN = "222",
            AnoPublicacao = 2024,
            AutorId = autorId,
            GeneroId = generoId
        };

        _livroRepositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(livroExistente);
        _autorRepositoryMock.Setup(r => r.ExistsAsync(autorId)).ReturnsAsync(true);
        _generoRepositoryMock.Setup(r => r.ExistsAsync(generoId)).ReturnsAsync(true);
        _livroRepositoryMock.Setup(r => r.ISBNExistsAsync("222", id)).ReturnsAsync(false);
        _livroRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Livro>())).ReturnsAsync((Livro l) => l);

        var result = await _service.UpdateAsync(id, dto);

        Assert.NotNull(result);
        Assert.Equal("Atualizado", result!.Titulo);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        var dto = new AtualizarLivroDto { Titulo = "Teste", ISBN = "123", AutorId = Guid.NewGuid(), GeneroId = Guid.NewGuid() };

        _livroRepositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Livro?)null);

        var result = await _service.UpdateAsync(id, dto);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenExists()
    {
        var id = Guid.NewGuid();
        _livroRepositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(true);

        var result = await _service.DeleteAsync(id);

        Assert.True(result);
        _livroRepositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _livroRepositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(false);

        var result = await _service.DeleteAsync(id);

        Assert.False(result);
    }
}
