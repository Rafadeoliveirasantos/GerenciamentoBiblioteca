using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class AutorDtoValidator : AbstractValidator<AutorDto>
{
    public AutorDtoValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Biografia)
            .MaximumLength(2000).WithMessage("Biografia deve ter no máximo 2000 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Biografia));

        RuleFor(x => x.DataNascimento)
            .LessThan(DateTime.Now).WithMessage("Data de nascimento deve ser no passado")
            .When(x => x.DataNascimento.HasValue);
    }
}
