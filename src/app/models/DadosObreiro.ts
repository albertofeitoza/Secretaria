import { Historico } from "./HistoricoDoObreiro";

export class DadosObreiro {
  id: number = 0
  pessoaId: number = 0
  frequentaReunioesMinisteriais: boolean = false
  frequentaDoutrinaEnsinamento: boolean = false;
  possuiChequeSemFundos: boolean = false;
  possuiProtestos: boolean = false;
  cartaoProvisorio : boolean = false;
  observacao: string;
  historico: Historico[];
}
