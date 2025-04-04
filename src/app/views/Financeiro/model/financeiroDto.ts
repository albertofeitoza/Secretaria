export class FinanceiroDto {
    id: number;
    dtCriacao: Date;
    assinaturaId: number;
    numeroCobranca: number;
    linkBoleto: string;
    dataVencimento: Date;
    statusPagamento: number;
}
