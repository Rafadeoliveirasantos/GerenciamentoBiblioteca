namespace API.DTOs.Autor
{
    public class AutorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string? Biografia { get; set; }
        public DateTime DataNascimento { get; set; }
    }
}
