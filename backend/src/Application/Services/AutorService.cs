using Application.DTOs;
using Application.ViewModels;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class AutorService
{
    private readonly IAutorRepository _repository;

    public AutorService(IAutorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AutorViewModel>> GetAllAsync()
    {
        var autores = await _repository.GetAllAsync();
        return autores.Select(MapToViewModel);
    }

    public async Task<AutorViewModel?> GetByIdAsync(Guid id)
    {
        var autor = await _repository.GetByIdAsync(id);
        return autor != null ? MapToViewModel(autor) : null;
    }

    public async Task<AutorViewModel> CreateAsync(CriarAutorDto dto)
    {
        var autor = new Autor
        {
            Id = Guid.NewGuid(),
            Nome = dto.Nome,
            Biografia = dto.Biografia,
            DataNascimento = dto.DataNascimento
        };

        var created = await _repository.CreateAsync(autor);
        return MapToViewModel(created);
    }

    public async Task<AutorViewModel?> UpdateAsync(Guid id, AtualizarAutorDto dto)
    {
        var autor = await _repository.GetByIdAsync(id);
        if (autor == null) return null;

        autor.Nome = dto.Nome;
        autor.Biografia = dto.Biografia;
        autor.DataNascimento = dto.DataNascimento;

        var updated = await _repository.UpdateAsync(autor);
        return MapToViewModel(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        if (!await _repository.ExistsAsync(id))
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    private static AutorViewModel MapToViewModel(Autor autor)
    {
        return new AutorViewModel
        {
            Id = autor.Id,
            Nome = autor.Nome,
            Biografia = autor.Biografia,
            DataNascimento = autor.DataNascimento
        };
    }
}
