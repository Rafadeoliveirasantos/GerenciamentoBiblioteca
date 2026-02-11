using Domain.Entities;

namespace Domain.Interfaces;

public interface IGeneroRepository
{
    Task<IEnumerable<Genero>> GetAllAsync();
    Task<Genero?> GetByIdAsync(Guid id);
    Task<Genero> CreateAsync(Genero genero);
    Task<Genero> UpdateAsync(Genero genero);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
