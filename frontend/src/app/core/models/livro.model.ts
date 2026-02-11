export interface Livro {
  id: string;
  titulo: string;
  isbn: string;
  anoPublicacao: number;
  sinopse?: string;
  capaUrl?: string;
  autorId: string;
  autorNome: string;
  generoId: string;
  generoNome: string;
}

export interface LivroDto {
  id?: string;
  titulo: string;
  isbn: string;
  anoPublicacao: number;
  sinopse?: string;
  capaUrl?: string;
  autorId: string;
  generoId: string;
}
