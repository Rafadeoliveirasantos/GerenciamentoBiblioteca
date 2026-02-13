using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Moq;
using Xunit;

namespace Application.Tests.Services;

public class GeneroServiceTests
{
    private readonly Mock<IGeneroRepository> _repositoryMock;
    private readonly GeneroService _service;

    public GeneroServiceTests()
    {
        _repositoryMock = new Mock<IGeneroRepository>();
        _service = new GeneroService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllGeneros()
    {
        var generos = new List<Genero>
        {
            new Genero { Id = Guid.NewGuid(), Nome = "Romance" },
            new Genero { Id = Guid.NewGuid(), Nome = "Ficção" }
        };

        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(generos);

        var result = await _service.GetAllAsync();

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task CreateAsync_CreatesGenero()
    {
        var dto = new CriarGeneroDto { Nome = "Terror", Descricao = "Livros de terror" };
        var genero = new Genero { Id = Guid.NewGuid(), Nome = dto.Nome, Descricao = dto.Descricao };

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Genero>())).ReturnsAsync(genero);

        var result = await _service.CreateAsync(dto);

        Assert.Equal(dto.Nome, result.Nome);
        Assert.Equal(dto.Descricao, result.Descricao);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsGenero_WhenExists()
    {
        var id = Guid.NewGuid();
        var genero = new Genero { Id = id, Nome = "Romance", Descricao = "Livros de romance" };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(genero);

        var result = await _service.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal("Romance", result!.Nome);
        Assert.Equal("Livros de romance", result.Descricao);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Genero?)null);

        var result = await _service.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsUpdatedGenero_WhenExists()
    {
        var id = Guid.NewGuid();
        var generoExistente = new Genero { Id = id, Nome = "Antigo", Descricao = "Desc antiga" };
        var dto = new AtualizarGeneroDto { Nome = "Atualizado", Descricao = "Desc nova" };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(generoExistente);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Genero>())).ReturnsAsync((Genero g) => g);

        var result = await _service.UpdateAsync(id, dto);

        Assert.NotNull(result);
        Assert.Equal("Atualizado", result!.Nome);
        Assert.Equal("Desc nova", result.Descricao);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenNotExists()
    {
        var id = Guid.NewGuid();
        var dto = new AtualizarGeneroDto { Nome = "Teste" };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Genero?)null);

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
    public async Task DeleteAsync_ReturnsFalse_WhenGeneroNotExists()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(false);

        var result = await _service.DeleteAsync(id);

        Assert.False(result);
    }
}
