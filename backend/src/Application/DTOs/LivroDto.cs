using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CriarLivroDto
{
    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(300, ErrorMessage = "O título deve ter no máximo 300 caracteres")]
    public string Titulo { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "O ISBN deve ter no máximo 20 caracteres")]
    public string? ISBN { get; set; }

    [Required(ErrorMessage = "O autor é obrigatório")]
    public Guid AutorId { get; set; }

    [Required(ErrorMessage = "O gênero é obrigatório")]
    public Guid GeneroId { get; set; }

    [Range(1000, 9999, ErrorMessage = "Ano de publicação inválido")]
    public int? AnoPublicacao { get; set; }

    [StringLength(2000, ErrorMessage = "A sinopse deve ter no máximo 2000 caracteres")]
    public string? Sinopse { get; set; }

    public string? CapaUrl { get; set; }
}

public class AtualizarLivroDto
{
    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(300, ErrorMessage = "O título deve ter no máximo 300 caracteres")]
    public string Titulo { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "O ISBN deve ter no máximo 20 caracteres")]
    public string? ISBN { get; set; }

    [Required(ErrorMessage = "O autor é obrigatório")]
    public Guid AutorId { get; set; }

    [Required(ErrorMessage = "O gênero é obrigatório")]
    public Guid GeneroId { get; set; }

    [Range(1000, 9999, ErrorMessage = "Ano de publicação inválido")]
    public int? AnoPublicacao { get; set; }

    [StringLength(2000, ErrorMessage = "A sinopse deve ter no máximo 2000 caracteres")]
    public string? Sinopse { get; set; }

    public string? CapaUrl { get; set; }
}

public class LivroDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? ISBN { get; set; }
    public Guid AutorId { get; set; }
    public string AutorNome { get; set; } = string.Empty;
    public Guid GeneroId { get; set; }
    public string GeneroNome { get; set; } = string.Empty;
    public int? AnoPublicacao { get; set; }
    public string? Sinopse { get; set; }
    public string? CapaUrl { get; set; }
}
