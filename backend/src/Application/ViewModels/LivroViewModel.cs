namespace Application.ViewModels;

public class LivroViewModel
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public int AnoPublicacao { get; set; }
    public string? Sinopse { get; set; }
    public string? CapaUrl { get; set; }
    public Guid AutorId { get; set; }
    public string AutorNome { get; set; } = string.Empty;
    public Guid GeneroId { get; set; }
    public string GeneroNome { get; set; } = string.Empty;
}
