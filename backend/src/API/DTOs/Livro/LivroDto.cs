namespace API.DTOs.Livro
{
    public class LivroDto
    {
        public string Id { get; set; } = string.Empty;
        public string Titulo { get; set; } = string.Empty;
        public string? ISBN { get; set; }
        public string AutorId { get; set; } = string.Empty;
        public string AutorNome { get; set; } = string.Empty;
        public string GeneroId { get; set; } = string.Empty;
        public string GeneroNome { get; set; } = string.Empty;
        public int? AnoPublicacao { get; set; }
        public string? Sinopse { get; set; }
        public string? CapaUrl { get; set; }
    }
}
