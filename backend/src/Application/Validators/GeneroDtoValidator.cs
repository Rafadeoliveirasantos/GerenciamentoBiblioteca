using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class GeneroDtoValidator : AbstractValidator<GeneroDto>
{
    public GeneroDtoValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(100).WithMessage("Nome deve ter no máximo 100 caracteres");

        RuleFor(x => x.Descricao)
            .MaximumLength(500).WithMessage("Descrição deve ter no máximo 500 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Descricao));
    }
}
