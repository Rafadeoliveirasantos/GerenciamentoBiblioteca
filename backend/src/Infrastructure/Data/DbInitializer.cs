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

        // Cria os gêneros literários modernos
        var generos = new[]
        {
            new Genero { Id = Guid.NewGuid(), Nome = "Romance", Descricao = "Romances contemporâneos" },
            new Genero { Id = Guid.NewGuid(), Nome = "Suspense", Descricao = "Thrillers e mistérios" },
            new Genero { Id = Guid.NewGuid(), Nome = "Juvenil", Descricao = "Literatura jovem adulto" },
            new Genero { Id = Guid.NewGuid(), Nome = "Literatura Brasileira", Descricao = "Autores brasileiros contemporâneos" },
            new Genero { Id = Guid.NewGuid(), Nome = "Fantasia", Descricao = "Ficção fantástica" },
            new Genero { Id = Guid.NewGuid(), Nome = "Autoajuda", Descricao = "Desenvolvimento pessoal" },
            new Genero { Id = Guid.NewGuid(), Nome = "Não-ficção", Descricao = "Obras de não-ficção" }
        };

        Console.WriteLine("Adicionando gêneros...");
        await context.Generos.AddRangeAsync(generos);
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {generos.Length} gêneros criados com sucesso");

        // Cria os autores de best-sellers modernos
        var autores = new[]
        {
            new Autor { Id = Guid.NewGuid(), Nome = "John Green", Biografia = "Autor americano de best-sellers juvenis, conhecido por 'A Culpa é das Estrelas'.", DataNascimento = new DateTime(1977, 8, 24) },
            new Autor { Id = Guid.NewGuid(), Nome = "Colleen Hoover", Biografia = "Autora americana de romances contemporâneos, fenômeno do TikTok.", DataNascimento = new DateTime(1979, 12, 11) },
            new Autor { Id = Guid.NewGuid(), Nome = "R.J. Palacio", Biografia = "Autora americana conhecida por 'Extraordinário'.", DataNascimento = new DateTime(1963, 7, 13) },
            new Autor { Id = Guid.NewGuid(), Nome = "Itamar Vieira Junior", Biografia = "Escritor brasileiro, vencedor do Prêmio Jabuti por 'Torto Arado'.", DataNascimento = new DateTime(1979, 1, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Alex Michaelides", Biografia = "Autor britânico-cipriota de thrillers psicológicos.", DataNascimento = new DateTime(1977, 9, 4) },
            new Autor { Id = Guid.NewGuid(), Nome = "Jenny Han", Biografia = "Autora americana de romances juvenis, conhecida pela trilogia 'Para Todos os Garotos'.", DataNascimento = new DateTime(1980, 9, 3) },
            new Autor { Id = Guid.NewGuid(), Nome = "Matthew Quick", Biografia = "Autor americano conhecido por 'O Lado Bom da Vida'.", DataNascimento = new DateTime(1973, 1, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Kiera Cass", Biografia = "Autora americana de ficção juvenil, criadora da série 'A Seleção'.", DataNascimento = new DateTime(1981, 5, 19) },
            new Autor { Id = Guid.NewGuid(), Nome = "Raphael Montes", Biografia = "Escritor brasileiro de thrillers e suspense.", DataNascimento = new DateTime(1990, 10, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Hal Elrod", Biografia = "Autor americano de desenvolvimento pessoal, criador de 'O Milagre da Manhã'.", DataNascimento = new DateTime(1979, 5, 30) },
            new Autor { Id = Guid.NewGuid(), Nome = "Djamila Ribeiro", Biografia = "Filósofa, feminista e escritora brasileira.", DataNascimento = new DateTime(1980, 1, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Beth O'Leary", Biografia = "Autora britânica de romances contemporâneos.", DataNascimento = new DateTime(1992, 1, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Charlie Donlea", Biografia = "Autor americano de thrillers e mistérios.", DataNascimento = new DateTime(1970, 1, 1) },
            new Autor { Id = Guid.NewGuid(), Nome = "Ailton Krenak", Biografia = "Líder indígena, ambientalista e escritor brasileiro.", DataNascimento = new DateTime(1953, 9, 29) },
            new Autor { Id = Guid.NewGuid(), Nome = "Padre Fábio de Melo", Biografia = "Padre, cantor e escritor brasileiro.", DataNascimento = new DateTime(1971, 4, 3) },
            new Autor { Id = Guid.NewGuid(), Nome = "Carol S. Dweck", Biografia = "Psicóloga e professora americana, autora de 'Mindset'.", DataNascimento = new DateTime(1946, 10, 17) },
            new Autor { Id = Guid.NewGuid(), Nome = "Paula Pimenta", Biografia = "Escritora brasileira de literatura juvenil.", DataNascimento = new DateTime(1976, 10, 16) },
            new Autor { Id = Guid.NewGuid(), Nome = "Augusto Cury", Biografia = "Psiquiatra e escritor brasileiro.", DataNascimento = new DateTime(1958, 10, 2) }
        };

        Console.WriteLine("Adicionando autores...");
        await context.Autores.AddRangeAsync(autores);
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {autores.Length} autores criados com sucesso");

        // Popula os livros com best-sellers modernos (2010-2025)
        var livros = new[]
        {
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Culpa é das Estrelas",
                ISBN = "978-8580572261",
                AnoPublicacao = 2012,
                Sinopse = "Hazel e Gus são dois adolescentes que se conhecem em um Grupo de Apoio para Crianças com Câncer. Juntos, eles compartilham um humor inteligente e um desprezo por tudo que é convencional.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/evuwt6Z5fVcC?fife=w400-h600",
                AutorId = autores[0].Id,
                GeneroId = generos[0].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "É Assim Que Acaba",
                ISBN = "978-8501116",
                AnoPublicacao = 2018,
                Sinopse = "Lily Bloom decide começar uma nova vida em Boston e abrir a própria floricultura. Quando conhece Ryle Kincaid, um neurocirurgião confiante, teimoso e talvez até um pouco arrogante, tudo parece perfeito.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/TZyFDwAAQBAJ?fife=w400-h600",
                AutorId = autores[1].Id,
                GeneroId = generos[0].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Verity",
                ISBN = "978-8501117793",
                AnoPublicacao = 2021,
                Sinopse = "Lowen Ashleigh é contratada para terminar os livros da famosa autora Verity Crawford. Ao revisar os manuscritos, ela encontra uma autobiografia secreta que revela segredos perturbadores.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/kQMTrgEACAAJ?fife=w400-h600",
                AutorId = autores[1].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Extraordinário",
                ISBN = "978-8580573565",
                AnoPublicacao = 2013,
                Sinopse = "August Pullman é um menino de 10 anos que nasceu com uma deformidade facial. Pela primeira vez, ele vai frequentar uma escola regular e precisa se esforçar para conquistar seu espaço.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/0RqJDQAAQBAJ?fife=w400-h600",
                AutorId = autores[2].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Torto Arado",
                ISBN = "978-8551005675",
                AnoPublicacao = 2019,
                Sinopse = "Vencedor do Prêmio Jabuti, o romance narra a história de duas irmãs que vivem em uma fazenda no interior da Bahia, abordando temas como racismo, desigualdade e resistência.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/XBrXDwAAQBAJ?fife=w400-h600",
                AutorId = autores[3].Id,
                GeneroId = generos[3].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Paciente Silenciosa",
                ISBN = "978-8501116697",
                AnoPublicacao = 2019,
                Sinopse = "Alicia Berenson mata o marido com cinco tiros e nunca mais fala uma palavra. O psicoterapeuta Theo Faber está obcecado em descobrir o motivo do crime.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/hAl5DwAAQBAJ?fife=w400-h600",
                AutorId = autores[4].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Para Todos os Garotos Que Já Amei",
                ISBN = "978-8580579062",
                AnoPublicacao = 2014,
                Sinopse = "Lara Jean guarda suas cartas de amor em uma caixa que sua mãe lhe deu. Quando as cartas são misteriosamente enviadas, sua vida amorosa sai do controle.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/975-BAAAQBAJ?fife=w400-h600",
                AutorId = autores[5].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Lado Bom da Vida",
                ISBN = "978-8580571424",
                AnoPublicacao = 2012,
                Sinopse = "Pat Peoples está determinado a reconstruir sua vida e reconquistar sua ex-esposa. Mas quando conhece Tiffany, uma jovem com problemas próprios, sua vida toma um rumo inesperado.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/HMm7AAAAQBAJ?fife=w400-h600",
                AutorId = autores[6].Id,
                GeneroId = generos[0].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Seleção",
                ISBN = "978-8576862178",
                AnoPublicacao = 2012,
                Sinopse = "Para 35 garotas, a Seleção é a chance de uma vida. A oportunidade de escapar da vida que foi planejada para elas desde o nascimento e viver em um mundo de vestidos deslumbrantes e joias preciosas.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/bjUuDwAAQBAJ?fife=w400-h600",
                AutorId = autores[7].Id,
                GeneroId = generos[4].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Bom Dia, Verônica",
                ISBN = "978-8551002841",
                AnoPublicacao = 2016,
                Sinopse = "A delegada Verônica Torres investiga casos de violência doméstica em São Paulo. Quando uma mulher se suicida na delegacia, ela descobre uma rede de crimes muito maior.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/6WnPDQAAQBAJ?fife=w400-h600",
                AutorId = autores[8].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "O Milagre da Manhã",
                ISBN = "978-8576849940",
                AnoPublicacao = 2016,
                Sinopse = "Hal Elrod mostra como acordar cedo e dedicar um tempo para o desenvolvimento pessoal pode transformar qualquer área da sua vida, antes das 8h da manhã.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/SkI5DwAAQBAJ?fife=w400-h600",
                AutorId = autores[9].Id,
                GeneroId = generos[5].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Pequeno Manual Antirracista",
                ISBN = "978-8535932331",
                AnoPublicacao = 2019,
                Sinopse = "Djamila Ribeiro apresenta caminhos de reflexão para aqueles que desejam aprofundar sua percepção sobre discriminações racistas estruturais e assumir a responsabilidade pela transformação do estado das coisas.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/BIK7DwAAQBAJ?fife=w400-h600",
                AutorId = autores[10].Id,
                GeneroId = generos[6].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Teto Para Dois",
                ISBN = "978-8551005361",
                AnoPublicacao = 2019,
                Sinopse = "Tiffy e Leon dividem um apartamento, mas nunca se encontram. Ela usa a cama de dia, ele à noite. Mas quando começam a deixar bilhetes um para o outro, uma amizade inusitada floresce.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/h_2ODwAAQBAJ?fife=w400-h600",
                AutorId = autores[11].Id,
                GeneroId = generos[0].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "A Garota do Lago",
                ISBN = "978-8594540942",
                AnoPublicacao = 2017,
                Sinopse = "Kelsey Castle desapareceu há um ano. Quando seu corpo é encontrado, a investigação revela segredos perturbadores sobre a jovem e sua família.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/Vv8uDwAAQBAJ?fife=w400-h600",
                AutorId = autores[12].Id,
                GeneroId = generos[1].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Ideias Para Adiar o Fim do Mundo",
                ISBN = "978-8535932997",
                AnoPublicacao = 2019,
                Sinopse = "Ailton Krenak desenvolve uma crítica à civilização ocidental, propondo uma reflexão sobre nossa relação com a natureza e os povos indígenas.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/rsjADwAAQBAJ?fife=w400-h600",
                AutorId = autores[13].Id,
                GeneroId = generos[6].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "November 9",
                ISBN = "978-8501115706",
                AnoPublicacao = 2020,
                Sinopse = "Fallon e Ben se conhecem no dia em que ela está se mudando de Los Angeles para Nova York. Eles decidem se encontrar no mesmo dia todos os anos. Mas será que o destino está do lado deles?",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/n8AqDwAAQBAJ?fife=w400-h600",
                AutorId = autores[1].Id,
                GeneroId = generos[0].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Quem Me Roubou de Mim?",
                ISBN = "978-8542212129",
                AnoPublicacao = 2018,
                Sinopse = "Padre Fábio de Melo reflete sobre como nos perdemos de nós mesmos ao longo da vida e como podemos nos reencontrar.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/lMxaDwAAQBAJ?fife=w400-h600",
                AutorId = autores[14].Id,
                GeneroId = generos[5].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Mindset: A Nova Psicologia do Sucesso",
                ISBN = "978-8547000240",
                AnoPublicacao = 2017,
                Sinopse = "Carol Dweck revela como o sucesso pode ser alcançado pela maneira como pensamos sobre nossos talentos e habilidades. Pessoas com mentalidade fixa acreditam que suas qualidades são imutáveis.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/fdjsz2VMyN4C?fife=w400-h600",
                AutorId = autores[15].Id,
                GeneroId = generos[6].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Fazendo Meu Filme 1",
                ISBN = "978-8501080714",
                AnoPublicacao = 2008,
                Sinopse = "Fani tem 16 anos e vive uma montanha-russa de emoções típicas da adolescência. Ela registra tudo em seu blog, compartilhando suas aventuras, paixões e descobertas.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/8jUuDwAAQBAJ?fife=w400-h600",
                AutorId = autores[16].Id,
                GeneroId = generos[2].Id
            },
            new Livro
            {
                Id = Guid.NewGuid(),
                Titulo = "Ansiedade: Como Enfrentar o Mal do Século",
                ISBN = "978-8582852927",
                AnoPublicacao = 2014,
                Sinopse = "Augusto Cury apresenta técnicas para gerenciar a ansiedade e o estresse da vida moderna, baseadas em sua teoria da inteligência multifocal.",
                CapaUrl = "https://books.google.com/books/publisher/content/images/frontcover/gLBfDwAAQBAJ?fife=w400-h600",
                AutorId = autores[17].Id,
                GeneroId = generos[5].Id
            }
        };

        Console.WriteLine($"Adicionando {livros.Length} livros...");
        await context.Livros.AddRangeAsync(livros);
        Console.WriteLine("Salvando livros no banco de dados...");
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ {livros.Length} livros criados com sucesso");
        Console.WriteLine("✅ Seed concluído com sucesso!");
    }
}
