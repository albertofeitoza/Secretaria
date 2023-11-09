import { HistoricoDoObreiro } from "./HistoricoDoObreiro";

export interface DadosObreiro {
  id: number;
  pessoaId: number;
  frequentaReunioesMinisteriais: boolean;
  frequentaDoutrinaEnsinamento: boolean;
  possuiChequeSemFundos: boolean;
  possuiProtestos: boolean;
  pastorApresentador: string;
  pastorRegional: string;
  observacao: string;
  historicoDoObreiro: HistoricoDoObreiro[];
}

