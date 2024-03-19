export class Historico {
  id: number = 0;
  dadosObreiroId: number = 0;
  data: Date = new Date;
  funcao: number = 0;
  entradaFuncao: number = 0 ;
  dataEntradaFuncao: Date;
  dataSaidaFuncao: Date;
  reintegrado: boolean = false;
  reintegradoEm: Date;
  aprovado: boolean = false;
  pastorApresentador : string;
  pastorRegional : string

}