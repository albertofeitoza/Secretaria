export class Precadastro {
    id: number;
    dataCriacao: Date;
    nome: string;
    rg: string;
    cpf: string;
    estadoCivil: number;
    dataNascimento: Date;
    profissao: string;
    grauInstrucao: number;
    sexo: number;
    naturalidade: string;
    naturalidadeEstado: string;
    nomeConjuge: string;
    dataCasamento: Date;
    statusPessoa: number;
    fotoCadastrada: boolean;
    idoso: boolean;
    nomePai: string;
    nomeMae: string;
    cpfConjuge: string;
    igrejaId: number;
    pessoaEndereco: PessoaEndereco;
    contatos: Contato[];
    dadosMembro: DadosMembro;
}

export class Contato {
    id: number;
    pessoaId: number;
    ddd: number = 0;
    telefone: number = 0;
    celular: number = 0;
    email: string = '';
}

export class DadosMembro {
    id: number = 0;
    pessoaId: number = 0;
    rol: number = 0;
    congregacao: string = '';
    regional: string = '';
    batismoFilhoCrente: boolean;
    batismoFilhoNaoCrente: boolean;
    fezDiscipulado: boolean;
    batismoAguas: Date = new Date();
    batismoAguasIgreja: string = '';
    batismoAguasCidade: string = '';
    batismoAguasEstado: string = '';
    batismoESanto: Date;
    membroDesde: Date;
    validadeCartaoMembro: Date;
    cursoTeologico: number;
    cursoTeologicoOndeCursou: string = '';
    dizimista: boolean;
    frequentaEbd: boolean;
    funcao: number;
    mudancaComCarta: Date;
    mudancaComCartaIgreja: string = '';
    mudancaSemCarta: Date;
    comunhao: Date;
    procedencia: string = '';
    observacao: string = '';
    batismoESantoIgreja: string = '';
    mudancaComCartaIgrejaEstado: string = '';
}

export class PessoaEndereco {
    id: number;
    pessoaId: number;
    dtCriacao: Date;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: number;
    complemento: string;
}
