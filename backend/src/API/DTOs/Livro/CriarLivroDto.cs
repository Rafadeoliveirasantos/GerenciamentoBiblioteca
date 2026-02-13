using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Livro
{
    public class CriarLivroDto
    {
        [Required(ErrorMessage = "O título é obrigatório")]
        [StringLength(300, ErrorMessage = "O título deve ter no máximo 300 caracteres")]
        public string Titulo { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "O ISBN deve ter no máximo 20 caracteres")]
        public string? ISBN { get; set; }

        [Required(ErrorMessage = "O autor é obrigatório")]
        public string AutorId { get; set; } = string.Empty;

        [Required(ErrorMessage = "O gênero é obrigatório")]
        public string GeneroId { get; set; } = string.Empty;

        [Range(1000, 9999, ErrorMessage = "Ano de publicação inválido")]
        public int? AnoPublicacao { get; set; }

        [StringLength(2000, ErrorMessage = "A sinopse deve ter no máximo 2000 caracteres")]
        public string? Sinopse { get; set; }

        [Url(ErrorMessage = "URL da capa inválida")]
        public string? CapaUrl { get; set; }
    }
}
