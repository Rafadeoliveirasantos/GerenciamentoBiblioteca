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

    // TODO: adicionar paginação aqui no futuro
    public async Task<IEnumerable<LivroViewModel>> GetAllAsync()
    {
        var resultado = await _livroRepository.GetAllAsync();
        return resultado.Select(MapToViewModel);
    }

    public async Task<LivroViewModel?> GetByIdAsync(Guid id)
    {
        var livroEncontrado = await _livroRepository.GetByIdAsync(id);
        return livroEncontrado != null ? MapToViewModel(livroEncontrado) : null;
    }

    public async Task<LivroViewModel> CreateAsync(CriarLivroDto dto)
    {
        // Valida se o autor existe antes de criar o livro
        var autorExiste = await _autorRepository.ExistsAsync(dto.AutorId);
        if (!autorExiste)
            throw new InvalidOperationException("Autor não encontrado");

        // Valida se o gênero existe
        if (!await _generoRepository.ExistsAsync(dto.GeneroId))
            throw new InvalidOperationException("Gênero não encontrado");

        // FIXME: melhorar validação de ISBN (verificar formato)
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

        Livro criado = await _livroRepository.CreateAsync(livro);
        return MapToViewModel(criado);
    }

    public async Task<LivroViewModel?> UpdateAsync(Guid id, AtualizarLivroDto dto)
    {
        // Busca o livro no banco antes de atualizar
        var livroExistente = await _livroRepository.GetByIdAsync(id);
        if (livroExistente == null) return null;

        if (!await _autorRepository.ExistsAsync(dto.AutorId))
            throw new InvalidOperationException("Autor não encontrado");

        if (!await _generoRepository.ExistsAsync(dto.GeneroId))
            throw new InvalidOperationException("Gênero não encontrado");

        // Valida se o ISBN já existe em outro livro
        if (await _livroRepository.ISBNExistsAsync(dto.ISBN, id))
            throw new InvalidOperationException("ISBN já cadastrado");

        // Atualiza os dados do livro
        livroExistente.Titulo = dto.Titulo;
        livroExistente.ISBN = dto.ISBN;
        livroExistente.AnoPublicacao = dto.AnoPublicacao;
        livroExistente.Sinopse = dto.Sinopse;
        livroExistente.CapaUrl = dto.CapaUrl;
        livroExistente.AutorId = dto.AutorId;
        livroExistente.GeneroId = dto.GeneroId;

        var atualizado = await _livroRepository.UpdateAsync(livroExistente);
        return MapToViewModel(atualizado);
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

        // Valida o arquivo antes de processar
        if (!_fileService.ValidarArquivo(arquivo))
            throw new InvalidOperationException("Arquivo inválido. Apenas JPG, JPEG e PNG são permitidos (máximo 5MB)");

        Console.WriteLine($"Processando upload da capa do livro: {livro.Titulo}");

        // Remove a capa antiga se existir (exceto URLs externas)
        if (!string.IsNullOrEmpty(livro.CapaUrl) && !livro.CapaUrl.StartsWith("http"))
        {
            await _fileService.DeletarCapaAsync(livro.CapaUrl);
        }

        string caminhoArquivo = await _fileService.SalvarCapaAsync(arquivo, livro.ISBN);
        livro.CapaUrl = caminhoArquivo;

        await _livroRepository.UpdateAsync(livro);
        Console.WriteLine($"Capa salva com sucesso: {caminhoArquivo}");
        return caminhoArquivo;
    }

    public async Task<bool> RemoverCapaAsync(Guid id)
    {
        var livroEncontrado = await _livroRepository.GetByIdAsync(id);
        if (livroEncontrado == null || string.IsNullOrEmpty(livroEncontrado.CapaUrl))
            return false;

        // Só deleta arquivos locais, não URLs externas
        if (!livroEncontrado.CapaUrl.StartsWith("http"))
        {
            await _fileService.DeletarCapaAsync(livroEncontrado.CapaUrl);
        }

        livroEncontrado.CapaUrl = null;
        await _livroRepository.UpdateAsync(livroEncontrado);
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
