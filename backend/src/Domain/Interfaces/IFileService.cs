using Microsoft.AspNetCore.Http;

namespace Domain.Interfaces;

public interface IFileService
{
    Task<string> SalvarCapaAsync(IFormFile arquivo, string isbn);
    Task DeletarCapaAsync(string caminhoArquivo);
    bool ValidarArquivo(IFormFile arquivo);
}
