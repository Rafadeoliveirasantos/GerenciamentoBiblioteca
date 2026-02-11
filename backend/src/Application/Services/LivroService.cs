using Application.DTOs;
using Application.ViewModels;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Application.Services;

public class LivroService
{
    private readonly ILivroRepository _livroRepository;
    private readonly IAutorRepository _autorRepository;
    private readonly IGeneroRepository _generoRepository;
    private readonly IFileService _fileService;

    public LivroService(
        ILivroRepository livroRepository,
        IAutorRepository autorRepository,
        IGeneroRepository generoRepository,
        IFileService fileService)
    {
        _livroRepository = livroRepository;
        _autorRepository = autorRepository;
        _generoRepository = generoRepository;
        _fileService = fileService;
    }

    public async Task<IEnumerable<LivroViewModel>> GetAllAsync()
    {
        var livros = await _livroRepository.GetAllAsync();
        return livros.Select(MapToViewModel);
    }

    public async Task<LivroViewModel?> GetByIdAsync(Guid id)
    {
        var livro = await _livroRepository.GetByIdAsync(id);
        return livro != null ? MapToViewModel(livro) : null;
    }

    public async Task<LivroViewModel> CreateAsync(LivroDto dto)
    {
        if (!await _autorRepository.ExistsAsync(dto.AutorId))
            throw new InvalidOperationException("Autor não encontrado");

        if (!await _generoRepository.ExistsAsync(dto.GeneroId))
            throw new InvalidOperationException("Gênero não encontrado");

        if (await _livroRepository.ISBNExistsAsync(dto.ISBN))
            throw new InvalidOperationException("ISBN já cadastrado");

        var livro = new Livro
        {
            Id = Guid.NewGuid(),
            Titulo = dto.Titulo,
            ISBN = dto.ISBN,
            AnoPublicacao = dto.AnoPublicacao,
            Sinopse = dto.Sinopse,
            CapaUrl = dto.CapaUrl,
            AutorId = dto.AutorId,
            GeneroId = dto.GeneroId
        };

        var created = await _livroRepository.CreateAsync(livro);
        return MapToViewModel(created);
    }

    public async Task<LivroViewModel?> UpdateAsync(Guid id, LivroDto dto)
    {
        var livro = await _livroRepository.GetByIdAsync(id);
        if (livro == null) return null;

        if (!await _autorRepository.ExistsAsync(dto.AutorId))
            throw new InvalidOperationException("Autor não encontrado");

        if (!await _generoRepository.ExistsAsync(dto.GeneroId))
            throw new InvalidOperationException("Gênero não encontrado");

        if (await _livroRepository.ISBNExistsAsync(dto.ISBN, id))
            throw new InvalidOperationException("ISBN já cadastrado");

        livro.Titulo = dto.Titulo;
        livro.ISBN = dto.ISBN;
        livro.AnoPublicacao = dto.AnoPublicacao;
        livro.Sinopse = dto.Sinopse;
        livro.CapaUrl = dto.CapaUrl;
        livro.AutorId = dto.AutorId;
        livro.GeneroId = dto.GeneroId;

        var updated = await _livroRepository.UpdateAsync(livro);
        return MapToViewModel(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        if (!await _livroRepository.ExistsAsync(id))
            return false;

        await _livroRepository.DeleteAsync(id);
        return true;
    }

    public async Task<string> UploadCapaAsync(Guid id, IFormFile arquivo)
    {
        var livro = await _livroRepository.GetByIdAsync(id);
        if (livro == null)
            throw new InvalidOperationException("Livro não encontrado");

        if (!_fileService.ValidarArquivo(arquivo))
            throw new InvalidOperationException("Arquivo inválido. Apenas JPG, JPEG e PNG são permitidos (máximo 5MB)");

        if (!string.IsNullOrEmpty(livro.CapaUrl) && !livro.CapaUrl.StartsWith("http"))
        {
            await _fileService.DeletarCapaAsync(livro.CapaUrl);
        }

        var caminhoArquivo = await _fileService.SalvarCapaAsync(arquivo, livro.ISBN);
        livro.CapaUrl = caminhoArquivo;

        await _livroRepository.UpdateAsync(livro);
        return caminhoArquivo;
    }

    public async Task<bool> RemoverCapaAsync(Guid id)
    {
        var livro = await _livroRepository.GetByIdAsync(id);
        if (livro == null || string.IsNullOrEmpty(livro.CapaUrl))
            return false;

        if (!livro.CapaUrl.StartsWith("http"))
        {
            await _fileService.DeletarCapaAsync(livro.CapaUrl);
        }

        livro.CapaUrl = null;
        await _livroRepository.UpdateAsync(livro);
        return true;
    }

    private static LivroViewModel MapToViewModel(Livro livro)
    {
        return new LivroViewModel
        {
            Id = livro.Id,
            Titulo = livro.Titulo,
            ISBN = livro.ISBN,
            AnoPublicacao = livro.AnoPublicacao,
            Sinopse = livro.Sinopse,
            CapaUrl = livro.CapaUrl,
            AutorId = livro.AutorId,
            AutorNome = livro.Autor?.Nome ?? string.Empty,
            GeneroId = livro.GeneroId,
            GeneroNome = livro.Genero?.Nome ?? string.Empty
        };
    }
}
