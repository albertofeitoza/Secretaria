import { ControleReuniaoObreiros } from "./ControleReuniaoObreiros";
import { ControleSantaCeia } from "./ControleSantaCeia";
import { DadosMembro } from "./DadosMembro";
import { PessoaEndereco } from "./PessoaEndereco";
import { Usuario } from "./Usuario";
import { contato } from "./contato";

export class Pessoa {
  id: number;
  dataCriacao: Date;
  nome: string;
  rg: string;
  cpf: string;
  fotoPath: string;
  estadoCivil: number;
  dataNascimento: Date;
  profissao: string;
  grauInstrucao: number;
  sexo: number;
  naturalidade: string;
  naturalidadeEstado: string;
  nomeConjuge: string;
  dataCasamento: Date;
  statusPessoa: number;
  usuario: Usuario;
  pessoaEndereco: PessoaEndereco;
  contatos: contato[];
  dadosMembro: DadosMembro;
  controleSantaCeia: ControleSantaCeia[];
  controleReuniaoObreiros: ControleReuniaoObreiros[];
}












