export interface Genero {
  id: string;
  nome: string;
  descricao?: string;
}

export interface GeneroDto {
  id?: string;
  nome: string;
  descricao?: string;
}
