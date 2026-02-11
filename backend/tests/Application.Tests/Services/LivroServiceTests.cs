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
        var dto = new LivroDto
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
        var dto = new LivroDto
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
}
