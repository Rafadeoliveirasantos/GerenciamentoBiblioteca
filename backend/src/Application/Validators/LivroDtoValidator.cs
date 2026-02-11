using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class LivroDtoValidator : AbstractValidator<LivroDto>
{
    public LivroDtoValidator()
    {
        RuleFor(x => x.Titulo)
            .NotEmpty().WithMessage("Título é obrigatório")
            .MaximumLength(300).WithMessage("Título deve ter no máximo 300 caracteres");

        RuleFor(x => x.ISBN)
            .NotEmpty().WithMessage("ISBN é obrigatório")
            .MaximumLength(20).WithMessage("ISBN deve ter no máximo 20 caracteres");

        RuleFor(x => x.AnoPublicacao)
            .GreaterThan(1000).WithMessage("Ano de publicação inválido")
            .LessThanOrEqualTo(DateTime.Now.Year).WithMessage("Ano de publicação não pode ser no futuro");

        RuleFor(x => x.Sinopse)
            .MaximumLength(5000).WithMessage("Sinopse deve ter no máximo 5000 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Sinopse));

        RuleFor(x => x.AutorId)
            .NotEmpty().WithMessage("Autor é obrigatório");

        RuleFor(x => x.GeneroId)
            .NotEmpty().WithMessage("Gênero é obrigatório");
    }
}
