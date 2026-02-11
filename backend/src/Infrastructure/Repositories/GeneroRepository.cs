using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GeneroRepository : IGeneroRepository
{
    private readonly BibliotecaDbContext _context;

    public GeneroRepository(BibliotecaDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Genero>> GetAllAsync()
    {
        return await _context.Generos
            .OrderBy(g => g.Nome)
            .ToListAsync();
    }

    public async Task<Genero?> GetByIdAsync(Guid id)
    {
        return await _context.Generos
            .Include(g => g.Livros)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<Genero> CreateAsync(Genero genero)
    {
        _context.Generos.Add(genero);
        await _context.SaveChangesAsync();
        return genero;
    }

    public async Task<Genero> UpdateAsync(Genero genero)
    {
        _context.Generos.Update(genero);
        await _context.SaveChangesAsync();
        return genero;
    }

    public async Task DeleteAsync(Guid id)
    {
        var genero = await _context.Generos.FindAsync(id);
        if (genero != null)
        {
            _context.Generos.Remove(genero);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Generos.AnyAsync(g => g.Id == id);
    }
}
