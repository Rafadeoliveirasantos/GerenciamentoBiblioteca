using Domain.Entities;

namespace Domain.Interfaces;

public interface IAutorRepository
{
    Task<IEnumerable<Autor>> GetAllAsync();
    Task<Autor?> GetByIdAsync(Guid id);
    Task<Autor> CreateAsync(Autor autor);
    Task<Autor> UpdateAsync(Autor autor);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
