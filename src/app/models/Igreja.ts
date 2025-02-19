export class igreja {
    id: number;
    nome: string;
    cnpj: string;
    estado: string;
    cidade: string;
    igrejaMae: number = 0;
    status: boolean;
    dominio: string
    tipoIgreja: number
}

export class ViewIgreja {
    id: number;
    nome: string;
    nomeIgrejaMae: string;
    cnpj: string;
    estado: string;
    cidade: string;
    igrejaMae: number = 0;
    status: boolean;
    dominio: string;
}

export class TodasAsIgrejas{
    id: number = 0;
    nome: string;
    idMae: number;
    tipoIgreja : number
}
