export class RelatorioAnivCasamento {
    nome: string
    dataNascimento: Date
    dataAniversario: Date
    nomeConjuge: string;
    dataCasamento: string;
    quantidadeAnosCasado: number;
    tipoRelatorio: number
}

export class RelatorioMembrosAtivos {
    nome: string
    rol: number
    congregacao: string
    validadeCartaoMembro: Date
    dataBatismo: Date
}

export class RelatorioIdosos {
    nome: string
    endereco: string
    ultimaSantaCeia: string
}
export class RelatorioPresenca {
    nome: string
    janeiro: string
    fevereiro: string
    marco: string
    abril: string
    maio: string
    junho: string
    julho: string
    agosto: string
    setembro: string
    outubro: string
    novembro: string
    dezembro: string
    participacao: string

}

export class ViewPastores {
    igreja: string
    pastor: string
    esposa: string
    datainicial: string
    membrosinicial: string
    membrossaida: string
    saldomembros: string
    status: string
}
