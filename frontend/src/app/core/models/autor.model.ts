export interface Autor {
  id: string;
  nome: string;
  biografia?: string;
  dataNascimento?: Date;
}

export interface AutorDto {
  id?: string;
  nome: string;
  biografia?: string;
  dataNascimento?: Date;
}
