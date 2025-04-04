export class ViewAssinaturas {
    id: number;
    igreja: string;
    nome: string;
    cpf: string;
    diaVencimento: number;
    tolerancia: number;
    telefone: string;
    email: string;
    idAssinatura: number;
}

export class AssinaturaDto {
    id: number = 0;
    idAssinatura: number;
    nome: string;
    cpf: string;
    diaVencimento: number;
    tolerancia: number;
    telefone: string;
    email: string;
    igrejaId: number;
}
