using Application.DTOs;
using Application.ViewModels;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class GeneroService
{
    private readonly IGeneroRepository _repository;

    public GeneroService(IGeneroRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<GeneroViewModel>> GetAllAsync()
    {
        var generos = await _repository.GetAllAsync();
        return generos.Select(MapToViewModel);
    }

    public async Task<GeneroViewModel?> GetByIdAsync(Guid id)
    {
        var genero = await _repository.GetByIdAsync(id);
        return genero != null ? MapToViewModel(genero) : null;
    }

    public async Task<GeneroViewModel> CreateAsync(GeneroDto dto)
    {
        var genero = new Genero
        {
            Id = Guid.NewGuid(),
            Nome = dto.Nome,
            Descricao = dto.Descricao
        };

        var created = await _repository.CreateAsync(genero);
        return MapToViewModel(created);
    }

    public async Task<GeneroViewModel?> UpdateAsync(Guid id, GeneroDto dto)
    {
        var genero = await _repository.GetByIdAsync(id);
        if (genero == null) return null;

        genero.Nome = dto.Nome;
        genero.Descricao = dto.Descricao;

        var updated = await _repository.UpdateAsync(genero);
        return MapToViewModel(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        if (!await _repository.ExistsAsync(id))
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    private static GeneroViewModel MapToViewModel(Genero genero)
    {
        return new GeneroViewModel
        {
            Id = genero.Id,
            Nome = genero.Nome,
            Descricao = genero.Descricao
        };
    }
}
