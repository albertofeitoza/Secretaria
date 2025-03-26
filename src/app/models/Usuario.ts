export class Usuario {
  id: number = 0;
  pessoaId: number = 0;
  nomeUsuario: string;
  senha: string;
  biometria: string;
  sessao: string;
  tipoUsuario: string;
  ativo: boolean;
  primeiroAcesso: boolean;
}

export class ResetSenha {
  cpf: string;
  token: string;
  novaSenha: string;
  novaSenhaConfirm: string;
  idUsuario: number;
  sequencia: number = 1;
  dominio: string;

}

export class DadosLogados {
  NomeUsuarioLogado: string;
  LoginSistema: string = "";
  TipoUsuarioLogado: number;
  IgrejaLogada: number;
  TipoIgrejaLogada: number;
  IgrejaSelecionada: number = 0;
}