export class ViewDocumentos {
    id: number;
    data: Date;
    descricao: string;
    nomeArqFisico: string;
    tipoDocumento: string;
}

export class DocumentosDto {
    id: number;
    pessoaId: number;
    data: Date;
    descricao: string;
    nomeArqFisico: string;
    tipoDocumento: number;
}
