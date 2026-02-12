using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(BibliotecaDbContext context)
    {
        // Verifica se já tem dados no banco
        var temDados = await context.Livros.AnyAsync();
        if (temDados)
        {
            Console.WriteLine("Banco já inicializado, pulando seed...");
            return;
        }

        Console.WriteLine("Iniciando seed do banco de dados...");

        // Cria os gêneros literários
        var generos = new[]
        {
            new Genero { Id = Guid.NewGuid(), Nome = "Romance", Descricao = "Obras de ficção narrativa" },
            new Genero { Id = Guid.NewGuid(), Nome = "Realismo", Descricao = "Movimento literário realista" },
            new Genero { Id = Guid.NewGuid(), Nome = "Modernismo", Descricao = "Literatura modernista brasileira" },
            new Genero { Id = Guid.NewGuid(), Nome = "Regionalismo", Descricao = "Literatura regionalista" },
            new Genero { Id = Guid.NewGuid(), Nome = "Romantismo", Descricao = "Literatura romântica" }
        };

        await context.Generos.AddRangeAsync(generos);
        await context.SaveChangesAsync();
        Console.WriteLine($"{generos.Length} gêneros criados");

        // TODO: adicionar mais autores contemporâneos
        // Cria os autores clássicos da literatura brasileira
        var autores = new[]
        {
            new Autor { Id = Guid.NewGuid(), Nome = "Machado de Assis", Biografia = "Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado por muitos críticos o maior nome da literatura brasileira.", DataNascimento = new DateTime(1839, 6, 21) },
            new Autor { Id = Guid.NewGuid(), Nome = "Guimarães Rosa", Biografia = "João Guimarães Rosa foi um escritor, diplomata, novelista, contista e médico brasileiro.", DataNascimento = new DateTime(1908, 6, 27) },
            new Autor { Id = Guid.NewGuid(), Nome = "Aluísio Azevedo", Biografia = "Aluísio Tancredo Gonçalves de Azevedo foi um escritor brasileiro, considerado um dos principais representantes do naturalismo no Brasil.", DataNascimento = new DateTime(1857, 4, 14) },
            new Autor { Id = Guid.NewGuid(), Nome = "Jorge Amado", Biografia = "Jorge Leal Amado de Faria foi um dos mais famosos e traduzidos escritores brasileiros de todos os tempos.", DataNascimento = new DateTime(1912, 8, 10) },
            new Autor { Id = Guid.NewGuid(), Nome = "Clarice Lispector", Biografia = "Clarice Lispector foi uma escritora e jornalista nascida na Ucrânia e naturalizada brasileira.", DataNascimento = new DateTime(1920, 12, 10) },
            new Autor { Id = Guid.NewGuid(), Nome = "Graciliano Ramos", Biografia = "Graciliano Ramos de Oliveira foi um romancista, cronista, contista, jornalista, político e memorialista brasileiro.", DataNascimento = new DateTime(1892, 10, 27) },
            new Autor { Id = Guid.NewGuid(), Nome = "Rachel de Queiroz", Biografia = "Rachel de Queiroz foi uma escritora, tradutora, romancista, cronista, jornalista e importante dramaturga brasileira.", DataNascimento = new DateTime(1910, 11, 17) },
            new Autor { Id = Guid.NewGuid(), Nome = "Mário de Andrade", Biografia = "Mário Raul de Morais Andrade foi um poeta, escritor, crítico literário, musicólogo, folclorista e ensaísta brasileiro.", DataNascimento = new DateTime(1893, 10, 9) },
            new Autor { Id = Guid.NewGuid(), Nome = "José de Alencar", Biografia = "José Martiniano de Alencar foi um jornalista, político, advogado, orador, crítico, cronista, polemista, romancista e dramaturgo brasileiro.", DataNascimento = new DateTime(1829, 5, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Lima Barreto", Biografia = "Afonso Henriques de Lima Barreto foi um jornalista e um dos mais importantes escritores libertários brasileiros.", DataNascimento = new DateTime(1881, 5, 13) },
            new Autor { Id = Guid.NewGuid(), Nome = "Érico Veríssimo", Biografia = "Érico Lopes Veríssimo foi um escritor brasileiro, autor de romances como O Tempo e o Vento.", DataNascimento = new DateTime(1905, 12, 17) },
            new Autor { Id = Guid.NewGuid(), Nome = "Cecília Meireles", Biografia = "Cecília Benevides de Carvalho Meireles foi uma poetisa, pintora, professora e jornalista brasileira.", DataNascimento = new DateTime(1901, 11, 7) }
        };

        await context.Autores.AddRangeAsync(autores);
        await context.SaveChangesAsync();
        Console.WriteLine($"{autores.Length} autores criados");

        // Popula os livros com obras clássicas
        var livros = new[]
        {
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Dom Casmurro",
                ISBN = "978-8535911664",
                AnoPublicacao = 1899,
                Sinopse = "A história de Bentinho e Capitu é um dos maiores clássicos da literatura brasileira. Narrado em primeira pessoa, o livro conta a história de amor e ciúme entre os dois personagens.",
                CapaUrl = "https://m.media-amazon.com/images/I/51fHHjVMJyL._SY445_SX342_.jpg",
                AutorId = autores[0].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Memórias Póstumas de Brás Cubas",
                ISBN = "978-8535911671",
                AnoPublicacao = 1881,
                Sinopse = "Narrado por um defunto, este romance revolucionou a literatura brasileira com seu estilo inovador e crítica social mordaz.",
                CapaUrl = "https://m.media-amazon.com/images/I/51jJu+oRIpL._SY445_SX342_.jpg",
                AutorId = autores[0].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Grande Sertão: Veredas",
                ISBN = "978-8535908770",
                AnoPublicacao = 1956,
                Sinopse = "Obra-prima de Guimarães Rosa, narra a história de Riobaldo, um jagunço que relembra sua vida no sertão mineiro.",
                CapaUrl = "https://m.media-amazon.com/images/I/51VKlxKf7pL._SY445_SX342_.jpg",
                AutorId = autores[1].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Cortiço",
                ISBN = "978-8508040711",
                AnoPublicacao = 1890,
                Sinopse = "Romance naturalista que retrata a vida em um cortiço carioca, mostrando as mazelas sociais do Brasil do século XIX.",
                CapaUrl = "https://m.media-amazon.com/images/I/51VrYGuW+5L._SY445_SX342_.jpg",
                AutorId = autores[2].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Capitães da Areia",
                ISBN = "978-8535914066",
                AnoPublicacao = 1937,
                Sinopse = "Romance que conta a história de um grupo de meninos de rua em Salvador, liderados por Pedro Bala.",
                CapaUrl = "https://m.media-amazon.com/images/I/51dQKGgFb7L._SY445_SX342_.jpg",
                AutorId = autores[3].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Hora da Estrela",
                ISBN = "978-8520925683",
                AnoPublicacao = 1977,
                Sinopse = "Último romance de Clarice Lispector, conta a história de Macabéa, uma nordestina que vive no Rio de Janeiro.",
                CapaUrl = "https://m.media-amazon.com/images/I/41VnW8ZqVvL._SY445_SX342_.jpg",
                AutorId = autores[4].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Vidas Secas",
                ISBN = "978-8501012371",
                AnoPublicacao = 1938,
                Sinopse = "Romance que retrata a vida de uma família de retirantes no sertão nordestino durante a seca.",
                CapaUrl = "https://m.media-amazon.com/images/I/51xJZJv9pxL._SY445_SX342_.jpg",
                AutorId = autores[5].Id,
                GeneroId = generos[3].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Quinze",
                ISBN = "978-8503012089",
                AnoPublicacao = 1930,
                Sinopse = "Romance que narra os efeitos da grande seca de 1915 no Ceará sobre a vida dos sertanejos.",
                CapaUrl = "https://m.media-amazon.com/images/I/51XqhXwN9pL._SY445_SX342_.jpg",
                AutorId = autores[6].Id,
                GeneroId = generos[3].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Macunaíma",
                ISBN = "978-8503010917",
                AnoPublicacao = 1928,
                Sinopse = "Rapsódia que narra as aventuras do herói sem nenhum caráter, misturando elementos do folclore brasileiro.",
                CapaUrl = "https://m.media-amazon.com/images/I/51wHLqH5vOL._SY445_SX342_.jpg",
                AutorId = autores[7].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Iracema",
                ISBN = "978-8508117468",
                AnoPublicacao = 1865,
                Sinopse = "Lenda do Ceará que narra o amor entre a índia Iracema e o português Martim.",
                CapaUrl = "https://m.media-amazon.com/images/I/51dBOUNE8eL._SY445_SX342_.jpg",
                AutorId = autores[8].Id,
                GeneroId = generos[4].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Triste Fim de Policarpo Quaresma",
                ISBN = "978-8508117475",
                AnoPublicacao = 1915,
                Sinopse = "Romance que satiriza o nacionalismo exacerbado através da história de Policarpo Quaresma.",
                CapaUrl = "https://m.media-amazon.com/images/I/51Ks9EqU5LL._SY445_SX342_.jpg",
                AutorId = autores[9].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Tempo e o Vento - O Continente",
                ISBN = "978-8535911350",
                AnoPublicacao = 1949,
                Sinopse = "Primeira parte da trilogia que narra 200 anos da história do Rio Grande do Sul através da família Terra Cambará.",
                CapaUrl = "https://m.media-amazon.com/images/I/51yzQjYPqBL._SY445_SX342_.jpg",
                AutorId = autores[10].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Quincas Borba",
                ISBN = "978-8535911688",
                AnoPublicacao = 1891,
                Sinopse = "Romance que narra a história de Rubião, herdeiro de Quincas Borba, e sua ascensão e queda social.",
                CapaUrl = "https://m.media-amazon.com/images/I/51cOVYbLiIL._SY445_SX342_.jpg",
                AutorId = autores[0].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Paixão Segundo G.H.",
                ISBN = "978-8520936344",
                AnoPublicacao = 1964,
                Sinopse = "Romance introspectivo que narra a experiência existencial de G.H. após um encontro com uma barata.",
                CapaUrl = "https://m.media-amazon.com/images/I/41lVx8WQFSL._SY445_SX342_.jpg",
                AutorId = autores[4].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "São Bernardo",
                ISBN = "978-8501012388",
                AnoPublicacao = 1934,
                Sinopse = "Romance que narra a história de Paulo Honório, fazendeiro que reconstrói a fazenda São Bernardo.",
                CapaUrl = "https://m.media-amazon.com/images/I/51xqRLJkqiL._SY445_SX342_.jpg",
                AutorId = autores[5].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Gabriela, Cravo e Canela",
                ISBN = "978-8535914073",
                AnoPublicacao = 1958,
                Sinopse = "Romance que narra a história de amor entre Nacib e Gabriela na cidade de Ilhéus nos anos 1920.",
                CapaUrl = "https://m.media-amazon.com/images/I/51YcKqhBOyL._SY445_SX342_.jpg",
                AutorId = autores[3].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Romanceiro da Inconfidência",
                ISBN = "978-8526020986",
                AnoPublicacao = 1953,
                Sinopse = "Obra poética que reconta os eventos da Inconfidência Mineira através de romances e canções.",
                CapaUrl = "https://m.media-amazon.com/images/I/41S8gVQJYxL._SY445_SX342_.jpg",
                AutorId = autores[11].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Guarani",
                ISBN = "978-8508117451",
                AnoPublicacao = 1857,
                Sinopse = "Romance indianista que narra a história de amor entre Peri e Ceci no Brasil colonial.",
                CapaUrl = "https://m.media-amazon.com/images/I/51hNQIcGOdL._SY445_SX342_.jpg",
                AutorId = autores[8].Id,
                GeneroId = generos[4].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Sagarana",
                ISBN = "978-8520939031",
                AnoPublicacao = 1946,
                Sinopse = "Coletânea de nove contos que retratam o sertão mineiro com linguagem inovadora.",
                CapaUrl = "https://m.media-amazon.com/images/I/51nZJQqOJnL._SY445_SX342_.jpg",
                AutorId = autores[1].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Memorial de Aires",
                ISBN = "978-8535911695",
                AnoPublicacao = 1908,
                Sinopse = "Último romance de Machado de Assis, narrado em forma de diário pelo conselheiro Aires.",
                CapaUrl = "https://m.media-amazon.com/images/I/51Y0cZKNdOL._SY445_SX342_.jpg",
                AutorId = autores[0].Id,
                GeneroId = generos[1].Id
            }
        };

        await context.Livros.AddRangeAsync(livros);
        await context.SaveChangesAsync();
        Console.WriteLine($"{livros.Length} livros criados");
        Console.WriteLine("Seed concluído com sucesso!");
    }
}
