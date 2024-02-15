import { Cargos } from "./Cargos";

export class DadosMembro {
  id: number = 0
  pessoaId: number = 0;
  rol: number = 0;
  congregacao: string;
  regional: string;
  batismoFilhoCrente: boolean = false;
  batismoFilhoNaoCrente: boolean = false;
  fezDiscipulado: boolean = false;
  batismoAguas: Date;
  batismoAguasIgreja: string;
  batismoAguasCidade: string;
  batismoAguasEstado: string;
  batismoESanto: Date;
  membroDesde: Date;
  validadeCartaoMembro: Date;
  cursoTeologico: number = 0;
  cursoTeologicoOndeCursou: string;
  dizimista: boolean = false;
  frequentaEbd: boolean = false;
  funcao : number = 0;
  mudancaComCarta : Date;
  mudancaComCartaIgreja : string;
  mudancaSemCarta : Date;
  comunhao : Date;
  procedencia : string;
  observacao : string;
}

