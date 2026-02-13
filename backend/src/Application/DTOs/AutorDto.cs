using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CriarAutorDto
{
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "A biografia deve ter no máximo 2000 caracteres")]
    public string? Biografia { get; set; }

    [Required(ErrorMessage = "A data de nascimento é obrigatória")]
    public DateTime DataNascimento { get; set; }
}

public class AtualizarAutorDto
{
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "A biografia deve ter no máximo 2000 caracteres")]
    public string? Biografia { get; set; }

    [Required(ErrorMessage = "A data de nascimento é obrigatória")]
    public DateTime DataNascimento { get; set; }
}

public class AutorDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Biografia { get; set; }
    public DateTime DataNascimento { get; set; }
}
