using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class BibliotecaDbContext : DbContext
{
    public BibliotecaDbContext(DbContextOptions<BibliotecaDbContext> options) : base(options)
    {
    }

    public DbSet<Genero> Generos { get; set; }
    public DbSet<Autor> Autores { get; set; }
    public DbSet<Livro> Livros { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Genero>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descricao).HasMaxLength(500);
            entity.HasMany(e => e.Livros)
                .WithOne(l => l.Genero)
                .HasForeignKey(l => l.GeneroId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Autor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Biografia).HasMaxLength(2000);
            entity.HasMany(e => e.Livros)
                .WithOne(l => l.Autor)
                .HasForeignKey(l => l.AutorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Livro>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(300);
            entity.Property(e => e.ISBN).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.ISBN).IsUnique();
            entity.Property(e => e.Sinopse).HasMaxLength(5000);
            entity.Property(e => e.CapaUrl).HasMaxLength(500);
            entity.HasOne(e => e.Autor)
                .WithMany(a => a.Livros)
                .HasForeignKey(e => e.AutorId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Genero)
                .WithMany(g => g.Livros)
                .HasForeignKey(e => e.GeneroId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
