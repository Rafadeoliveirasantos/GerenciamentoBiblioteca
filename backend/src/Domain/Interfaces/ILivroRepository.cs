using Domain.Entities;

namespace Domain.Interfaces;

public interface ILivroRepository
{
    Task<IEnumerable<Livro>> GetAllAsync();
    Task<Livro?> GetByIdAsync(Guid id);
    Task<Livro> CreateAsync(Livro livro);
    Task<Livro> UpdateAsync(Livro livro);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> ISBNExistsAsync(string isbn, Guid? excludeId = null);
}
