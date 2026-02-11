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
        var extension = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        var fileName = $"{isbn.Replace("-", "")}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await arquivo.CopyToAsync(stream);
        }

        return $"/uploads/capas/{fileName}";
    }

    public Task DeletarCapaAsync(string caminhoArquivo)
    {
        if (string.IsNullOrEmpty(caminhoArquivo))
            return Task.CompletedTask;

        var fileName = Path.GetFileName(caminhoArquivo);
        var filePath = Path.Combine(_uploadPath, fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }

    public bool ValidarArquivo(IFormFile arquivo)
    {
        if (arquivo == null || arquivo.Length == 0)
            return false;

        if (arquivo.Length > MaxFileSize)
            return false;

        var extension = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        return _allowedExtensions.Contains(extension);
    }
}
