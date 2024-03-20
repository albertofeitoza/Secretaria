export class Pessoa {
  id: number = 0;
  dataCriacao: Date = new Date;
  nome: string;
  rg: string;
  cpf: string;
  estadoCivil: number = 0;
  dataNascimento: Date;
  profissao: string;
  grauInstrucao: number = 0;
  sexo: number = 0;
  naturalidade: string;
  naturalidadeEstado: string;
  nomeConjuge: string;
  dataCasamento?: Date;
  statusPessoa: number = 0;
  fotoCadastrada : boolean = false;
  idoso : boolean = false;
  nomePai : string;
  nomeMae : string;
  cpfConjuge: string;
}

export class ViewPessoa {
  id: number = 0;
  rol: number = 0;
  foto: string;
  nome: string;
  dataNascimento: Date;
  funcao: string
  statusPessoa: string
}