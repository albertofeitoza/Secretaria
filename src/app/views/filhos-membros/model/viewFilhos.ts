export class ViewFilhos {
  id: number = 0;
  nome: string;
  dataNascimento: Date;
  membro: boolean;
  idPai: number;
  nomePai: string;
  idMae: number;
  nomeMae: string;
  tipoFilho: number
}

export class DtoFilhos {
  id: number;
  dataCriacao: Date;
  nome: string;
  dataNascimento: Date;
  membro: boolean;
  idPai: number;
  idMae: number;
  igrejaId: number;
  tipoFilho: number;
}
