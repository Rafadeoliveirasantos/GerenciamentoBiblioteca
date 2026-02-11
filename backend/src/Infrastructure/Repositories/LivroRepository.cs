using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class LivroRepository : ILivroRepository
{
    private readonly BibliotecaDbContext _context;

    public LivroRepository(BibliotecaDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Livro>> GetAllAsync()
    {
        return await _context.Livros
            .Include(l => l.Autor)
            .Include(l => l.Genero)
            .OrderBy(l => l.Titulo)
            .ToListAsync();
    }

    public async Task<Livro?> GetByIdAsync(Guid id)
    {
        return await _context.Livros
            .Include(l => l.Autor)
            .Include(l => l.Genero)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<Livro> CreateAsync(Livro livro)
    {
        _context.Livros.Add(livro);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(livro.Id) ?? livro;
    }

    public async Task<Livro> UpdateAsync(Livro livro)
    {
        _context.Livros.Update(livro);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(livro.Id) ?? livro;
    }

    public async Task DeleteAsync(Guid id)
    {
        var livro = await _context.Livros.FindAsync(id);
        if (livro != null)
        {
            _context.Livros.Remove(livro);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Livros.AnyAsync(l => l.Id == id);
    }

    public async Task<bool> ISBNExistsAsync(string isbn, Guid? excludeId = null)
    {
        return await _context.Livros
            .AnyAsync(l => l.ISBN == isbn && (excludeId == null || l.Id != excludeId));
    }
}
