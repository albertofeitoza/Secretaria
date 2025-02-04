export class igreja {
    id: number;
    nome: string;
    cnpj: string;
    estado: string;
    cidade: string;
    igrejaMae: number = 0;
    status: boolean;
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
}
