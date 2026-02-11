namespace Application.ViewModels;

public class AutorViewModel
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Biografia { get; set; }
    public DateTime? DataNascimento { get; set; }
}
