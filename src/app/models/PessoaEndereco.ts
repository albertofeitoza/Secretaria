export class PessoaEndereco {
  id: number = 0;
  pessoaId: number = 0;
  dtCriacao: Date = new Date;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number = 0;
  complemento: string;
}