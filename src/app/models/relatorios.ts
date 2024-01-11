export class RelatorioAnivCasamento {
    nome: string
    dataNascimento : Date
    nomeConjuge: string;
    dataCasamento: string;
    quantidadeAnosCasado: number;
    tipoRelatorio : number
}

export class RelatorioMembrosAtivos{
    nome: string
    rol: number
    congregacao : string
    validadeCartaoMembro : Date
}

export class RelatorioIdosos{
    nome : string
    endereco : string
    ultimaSantaCeia : string
}