import { ControleReuniaoObreiros } from "./ControleReuniaoObreiros";
import { ControleSantaCeia } from "./ControleSantaCeia";
import { DadosMembro } from "./DadosMembro";
import { DadosObreiro } from "./DadosObreiro";
import { Logs } from "./Logs";
import { PessoaEndereco } from "./PessoaEndereco";
import { Usuario } from "./Usuario";
import { contatos } from "./contato";

export class Pessoa {
  id: number;
  dataCriacao: Date;
  nome: string;
  rg: string;
  cpf: string;
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
  contatos: contatos[];
  dadosMembro: DadosMembro;
  dadosObreiro : DadosObreiro
  controleSantaCeia: ControleSantaCeia[];
  controleReuniaoObreiros: ControleReuniaoObreiros[];
  logs : Logs[];
}












