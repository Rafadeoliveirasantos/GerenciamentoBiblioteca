using Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services;

public class FileService : IFileService
{
    private readonly string _uploadPath;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png" };
    private const long MaxFileSize = 5 * 1024 * 1024;

    public FileService()
    {
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "capas");
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<string> SalvarCapaAsync(IFormFile arquivo, string isbn)
    {
        // Gera nome único pro arquivo usando ISBN + GUID
        string extension = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        string nomeArquivo = $"{isbn.Replace("-", "")}_{Guid.NewGuid()}{extension}";
        var caminhoCompleto = Path.Combine(_uploadPath, nomeArquivo);

        Console.WriteLine($"Salvando capa: {nomeArquivo}");

        using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
        {
            await arquivo.CopyToAsync(stream);
        }

        return $"/uploads/capas/{nomeArquivo}";
    }

    public Task DeletarCapaAsync(string caminhoArquivo)
    {
        if (string.IsNullOrEmpty(caminhoArquivo))
            return Task.CompletedTask;

        string nomeArquivo = Path.GetFileName(caminhoArquivo);
        string caminhoCompleto = Path.Combine(_uploadPath, nomeArquivo);

        // Deleta o arquivo se ele existir
        if (File.Exists(caminhoCompleto))
        {
            File.Delete(caminhoCompleto);
            Console.WriteLine($"Capa deletada: {nomeArquivo}");
        }

        return Task.CompletedTask;
    }

    public bool ValidarArquivo(IFormFile arquivo)
    {
        if (arquivo == null || arquivo.Length == 0)
            return false;

        // Valida tamanho máximo (5MB)
        if (arquivo.Length > MaxFileSize)
            return false;

        // Valida extensão do arquivo
        var extensao = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        return _allowedExtensions.Contains(extensao);
    }
}
