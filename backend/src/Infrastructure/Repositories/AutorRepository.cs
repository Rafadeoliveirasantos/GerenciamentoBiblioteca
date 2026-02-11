using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AutorRepository : IAutorRepository
{
    private readonly BibliotecaDbContext _context;

    public AutorRepository(BibliotecaDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Autor>> GetAllAsync()
    {
        return await _context.Autores
            .OrderBy(a => a.Nome)
            .ToListAsync();
    }

    public async Task<Autor?> GetByIdAsync(Guid id)
    {
        return await _context.Autores
            .Include(a => a.Livros)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Autor> CreateAsync(Autor autor)
    {
        _context.Autores.Add(autor);
        await _context.SaveChangesAsync();
        return autor;
    }

    public async Task<Autor> UpdateAsync(Autor autor)
    {
        _context.Autores.Update(autor);
        await _context.SaveChangesAsync();
        return autor;
    }

    public async Task DeleteAsync(Guid id)
    {
        var autor = await _context.Autores.FindAsync(id);
        if (autor != null)
        {
            _context.Autores.Remove(autor);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Autores.AnyAsync(a => a.Id == id);
    }
}
