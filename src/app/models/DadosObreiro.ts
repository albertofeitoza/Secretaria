import { Historico } from "./HistoricoDoObreiro";

export class DadosObreiro {
  id: number;
  pessoaId: number;
  frequentaReunioesMinisteriais: boolean;
  frequentaDoutrinaEnsinamento: boolean;
  possuiChequeSemFundos: boolean;
  possuiProtestos: boolean;
  pastorApresentador: string;
  pastorRegional: string;
  cartaoProvisorio : boolean;
  observacao: string;
  historico: Historico[];
}

