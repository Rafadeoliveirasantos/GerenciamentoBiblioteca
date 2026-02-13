using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Moq;
using Xunit;

namespace Application.Tests.Services;

public class AutorServiceTests
{
    private readonly Mock<IAutorRepository> _repositoryMock;
    private readonly AutorService _service;

    public AutorServiceTests()
    {
        _repositoryMock = new Mock<IAutorRepository>();
        _service = new AutorService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllAutores()
    {
        var autores = new List<Autor>
        {
            new Autor { Id = Guid.NewGuid(), Nome = "John Green", Biografia = "Escritor americano" },
            new Autor { Id = Guid.NewGuid(), Nome = "Machado de Assis", Biografia = "Escritor brasileiro" }
        };

        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(autores);

        var result = await _service.GetAllAsync();

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsAutor_WhenExists()
    {
        var id = Guid.NewGuid();
        var autor = new Autor { Id = id, Nome = "John Green", Biografia = "Escritor americano", DataNascimento = new DateTime(1977, 8, 24) };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(autor);

        var result = await _service.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal("John Green", result!.Nome);
        Assert.Equal("Escritor americano", result.Biografia);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Autor?)null);

        var result = await _service.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesAutor()
    {
        var dto = new CriarAutorDto
        {
            Nome = "Novo Autor",
            Biografia = "Biografia do autor",
            DataNascimento = new DateTime(1990, 1, 1)
        };

        var autor = new Autor { Id = Guid.NewGuid(), Nome = dto.Nome, Biografia = dto.Biografia, DataNascimento = dto.DataNascimento };

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Autor>())).ReturnsAsync(autor);

        var result = await _service.CreateAsync(dto);

        Assert.Equal(dto.Nome, result.Nome);
        Assert.Equal(dto.Biografia, result.Biografia);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsUpdatedAutor_WhenExists()
    {
        var id = Guid.NewGuid();
        var autorExistente = new Autor { Id = id, Nome = "Antigo", Biografia = "Bio antiga", DataNascimento = new DateTime(1980, 1, 1) };
        var dto = new AtualizarAutorDto { Nome = "Atualizado", Biografia = "Bio nova", DataNascimento = new DateTime(1985, 5, 5) };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(autorExistente);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Autor>())).ReturnsAsync((Autor a) => a);

        var result = await _service.UpdateAsync(id, dto);

        Assert.NotNull(result);
        Assert.Equal("Atualizado", result!.Nome);
        Assert.Equal("Bio nova", result.Biografia);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        var dto = new AtualizarAutorDto { Nome = "Teste", DataNascimento = DateTime.Now };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Autor?)null);

        var result = await _service.UpdateAsync(id, dto);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenExists()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(true);

        var result = await _service.DeleteAsync(id);

        Assert.True(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(false);

        var result = await _service.DeleteAsync(id);

        Assert.False(result);
    }
}
