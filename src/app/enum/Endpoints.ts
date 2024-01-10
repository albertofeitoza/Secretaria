export enum Endpoint {
    Token = '/Token',
    Usuario = '/Usuarios',
    Pessoa = '/Pessoa',
    Membros = '/Membros',
    Obreiro = '/Obreiro',
    HistoricoObreiro = '/HistoricoObreiro',
    BuscaPorCpf = '/Pessoa/buscaPorCpf',
    Enderecos = '/Enderecos',
    Contatos = '/Contatos',
    Cargos = '/Cargos',
    Ofertas = '/Ofertas',  
    Relatorios = '/Relatorios',
    RelatoriosImprimir = '/Relatorios/ImprimirRelatorio',
    UploadArquivo = '/File/FotoPerfil',
    DownloadArquivo = '/File/DownloadArquivo',
    cep = 'https://viacep.com.br/ws/{0}/json',

}