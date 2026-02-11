namespace Domain.Entities;

public class Autor
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Biografia { get; set; }
    public DateTime? DataNascimento { get; set; }
    public ICollection<Livro> Livros { get; set; } = new List<Livro>();
}
