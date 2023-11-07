export class DadosMembro {
  id: number;
  pessoaId: number;
  rol: number;
  congregacao: string;
  regional: string;
  batismoFilhoCrente: boolean;
  batismoFilhoNaoCrente: boolean;
  fezDiscipulado: boolean;
  batismoAguas: Date;
  batismoAguasIgreja: string;
  batismoAguasCidade: string;
  batismoAguasEstado: string;
  batismoESanto: Date;
  membroDesde: Date;
  validadeCartaoMembro: Date;
  cursoTeologico: number;
  cursoTeologicoOndeCursou: string;
  dizimista: boolean;
  frequentaEbd: boolean;
}
