using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Autor
{
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
}
