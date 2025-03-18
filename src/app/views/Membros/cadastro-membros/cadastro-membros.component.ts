import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Cep } from 'src/app/models/Cep';
import { DadosMembro } from 'src/app/models/DadosMembro';
import { PessoaEndereco } from 'src/app/models/PessoaEndereco';
import { Pessoa, ViewFilhos } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { cpf } from 'cpf-cnpj-validator';
import { contatos } from 'src/app/models/contato';
import { Cargos } from 'src/app/models/Cargos';
import { Historico } from 'src/app/models/HistoricoDoObreiro';
import { DadosObreiro } from 'src/app/models/DadosObreiro';
import { Filtros } from 'src/app/models/Filtros';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Logs } from 'src/app/models/Logs';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { HistoricoPopupComponent } from '../historico-popup/historico-popup.component';
import { igreja } from 'src/app/models/Igreja';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-cadastro-membros',
  templateUrl: './cadastro-membros.component.html',
  styleUrls: ['./cadastro-membros.component.css']
})

export class CadastroMembrosComponent implements OnDestroy {
  contatoSelecionado = 0
  cargoSelecionado = 0
  logSelecionado = 0
  historicoSelecionado = 0
  step = 0;
  pessoa: Pessoa = new Pessoa();
  igreja: igreja = new igreja();
  endereco: PessoaEndereco = new PessoaEndereco();
  dadosMembro: DadosMembro = new DadosMembro();
  dadosObreiro: DadosObreiro = new DadosObreiro()
  fotoPerfil: string = ""
  cargos: Cargos[] = new Array()
  cargo: Cargos = new Cargos();
  funcaoMembroCache: number = 1;
  cursoTeologicoCache: number = 1;
  historicos: Historico[] = new Array()
  historico: Historico = new Historico()
  foto: FormData = new FormData()
  filtros: Filtros = new Filtros()
  logs: Logs[] = new Array()
  filhos: ViewFilhos = new ViewFilhos()
  situacaoCache: number = 0
  igrejaSelecionada = 0;
  idade = 0;
  idadeCasado = 0
  //--------------
  contatos: contatos[] = new Array()
  contato: contatos = new contatos();

  Colunas = ['id', 'ddd', 'telefone', 'celular', 'email', 'action']
  ColunasCargos = ['id', 'cargo', 'noCargoDesde', 'noCargoAte', 'action']
  ColunasHistoricoObreiro = ['id', 'pastorApresentador', 'pastorRegional', 'local', 'funcao', 'entradaFuncao', 'dataEntradaFuncao', 'dataSaidaFuncao', 'reintegrado', 'reintegradoEm', 'aprovado', 'action']
  colunasLogs = ['data', 'descricao']

  // ----------------

  //combos
  estCivil: any[]
  instrucao: any[]
  statusPessoa: any[]
  sexo: any[]
  cursoTeoligico: any[]
  funcao: any[]
  entradaFuncao: any[]

  spinner = false;

  constructor(
    private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private servicoCep: AllservicesService<Cep>,
    private activatedRoute: ActivatedRoute,
    private auth: AutenticacaoService
  ) { }

  ngOnInit() {

    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.auth.dadosUsuario.IgrejaSelecionada === 0 ?
      this.auth.dadosUsuario.IgrejaLogada : this.auth.dadosUsuario.IgrejaSelecionada;

    this.CarregarCombos()
    this.setStep(0)
    this.BuscarMembro()

  }

  ngOnDestroy(): void {
    this.serverApi;
    console.log()
  }


  BuscarMembro() {
    const id = Number(this.activatedRoute.snapshot.params['id']);

    if (id > 0) {
      this.fotoPerfil = "";
      this.serverApi.readById(id.toString(), Endpoint.Pessoa)
        .subscribe(response => {
          this.pessoa = response?.data?.pessoa != null ? response?.data?.pessoa : new Pessoa();
          this.igreja = response?.data?.igreja != null ? response?.data?.igreja : new igreja();
          this.endereco = response?.data?.pessoaEndereco != null ? response?.data?.pessoaEndereco : this.endereco = new PessoaEndereco();
          this.contatos = response?.data?.contatos
          this.dadosMembro = response?.data?.dadosMembro != null ? response?.data?.dadosMembro : this.dadosMembro = new DadosMembro()
          this.funcaoMembroCache = response?.data?.dadosMembro?.funcao
          this.situacaoCache = response?.data?.pessoa?.statusPessoa
          this.cargos = response?.data?.cargos
          this.dadosObreiro = response.data?.dadosObreiro != null ? response?.data?.dadosObreiro : this.dadosObreiro = new DadosObreiro()
          this.historicos = response?.data?.historicoObreiro
          this.logs = response?.data?.logs;
          this.filhos = response?.data?.filhos
          this.fotoPerfil = this.pessoa.fotoCadastrada ? `./assets/imagens/${this.pessoa.id}_${response.data.pessoa.cpf.trim()}.jpg` : `./assets/imagens/sem-foto.jpg`

          this.idade = this.serviceUtil.SubtractYears(this.pessoa.dataNascimento ? this.pessoa.dataNascimento : new Date)
          this.idadeCasado = this.serviceUtil.SubtractYears(this.pessoa.dataCasamento ? this.pessoa.dataCasamento : new Date)

        })


    }
  }
  CarregarCombos() {
    this.estCivil = this.serviceUtil.EstCivil();
    this.instrucao = this.serviceUtil.GrauInstrucao();
    this.statusPessoa = this.serviceUtil.StatusPessoa();
    this.sexo = this.serviceUtil.Sexo();
    this.cursoTeoligico = this.serviceUtil.CursoTeologico();
    this.funcao = this.serviceUtil.Funcao()
    this.entradaFuncao = this.serviceUtil.EntradaFuncao()
  }

  setStep(index: number) {
    this.step = index;
  }

  Proximo() {
    this.Salvar(this.step)
  }

  Voltar() {
    this.step--;
  }

  Salvar(step: number) {

    if (this.serviceUtil.ValidaCpf(this.pessoa.cpf)) {

      this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
      this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

      switch (step) {
        case 0:
          this.spinner = true;
          if (this.ValidarPessoa() && this.pessoa.id == 0) {
            this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', this.igrejaSelecionada).subscribe(response => {
              if (response.code != 200) {
                this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
                this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
                this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
                this.pessoa.igrejaId = Number(this.igrejaSelecionada)
                //salvar dados de Pessoa
                if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada) {
                  this.spinner = false;
                  return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");
                }


                this.serverApi.create(this.pessoa, Endpoint.Pessoa,).subscribe(x => {
                  this.step++;
                  this.spinner = false;
                  this.pessoa = x
                  this.serviceUtil.showMessage("Cadastro realizado");
                });

              } else {
                this.spinner = false;
                const igreja = response?.data?.nome?.split(';');
                this.serviceUtil.showMessage(`Já existe cadastro para o CPF informado : ${this.pessoa.cpf} Nome: ${igreja[0]} ${igreja[1]} `, true)
              }

            });
          }
          else {

            this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
            this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
            this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
            this.pessoa.igrejaId = this.igreja.id
            //Atualizando dados de Pessoa
            if (this.ValidarPessoa()) {

              this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', this.igrejaSelecionada)
                .subscribe(response => {

                  if (response.code == 200 && this.pessoa.cpf === response.data.cpf) {

                    if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada) {
                      this.spinner = false;
                      return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");
                    }


                    this.serverApi.create(this.pessoa, Endpoint.Pessoa,)
                      .subscribe(x => {
                        this.spinner = false;
                        this.step++;
                        this.pessoa = x
                        this.serviceUtil.showMessage(`Dados atualizados`, false)

                      });
                  } else {
                    this.spinner = false;
                    const igreja = response?.data?.nome?.split(';');
                    this.serviceUtil.showMessage(`Já existe cadastro para o CPF informado: ${this.pessoa.cpf} Nome: ${igreja[0]} ${igreja[1]} `, true)
                  }
                });
            }

          }
          this.spinner = false;
          break;
        case 1:
          this.spinner = true;
          if (this.ValidarEndereco() && this.pessoa.id > 0) {

            this.endereco.pessoaId = this.pessoa.id;

            //Salvar Endereço
            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada) {
              this.spinner = false;
              return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.")
            };

            this.serverApi.create(this.endereco, Endpoint.Enderecos)
              .subscribe(x => {
                this.endereco = x
                this.spinner = false;
                this.step++
                this.serviceUtil.showMessage("Endereço salvo", true);
              })
          }
          this.spinner = false;
          break;
        case 2:
        case 3:
          this.spinner = true;
          if (this.ValidarDadosMembro() && this.pessoa.id > 0) {

            this.dadosMembro.pessoaId = this.pessoa.id;

            if (this.dadosMembro.id === 0)
              this.dadosMembro.funcao = 1;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada) {
              this.spinner = false;
              return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");
            }


            this.serverApi.create(this.dadosMembro, Endpoint.Membros)
              .subscribe(x => {
                this.dadosMembro = x
                this.spinner = false;
                this.step++
              }, (err) => {
                this.spinner = false;
              })
          }
          this.spinner = false;
          break;

        case 4:
          this.spinner = true;
          if (this.pessoa.id > 0) {
            this.dadosObreiro.pessoaId = this.pessoa.id;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada) {
              this.spinner = false;
              return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");
            }

            this.serverApi.create(this.dadosObreiro, Endpoint.Obreiro)
              .subscribe(x => {
                this.dadosObreiro = x;
                this.spinner = false;
                this.serviceUtil.showMessage("Dados de obreiro salvo com suecsso!", true);
              });
          }
          this.spinner = false;
          break;
        default:
          break;
      }
    }
  }
  BuscarConjuje(keyEvent: any) {

    if (keyEvent.which == 13 || keyEvent.which == 9 || keyEvent.which == 1) {

      this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
      this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

      this.pessoa.cpfConjuge = this.pessoa.cpfConjuge.replace(/\D/g, '');
      this.pessoa.cpfConjuge = ("00000000000" + this.pessoa.cpfConjuge).slice(-11);

      if (this.pessoa.cpf == this.pessoa.cpfConjuge)
        return this.serviceUtil.showMessage(`O CPF informado é mesmo da pessoa ${this.pessoa.nome}.`, true);

      if (this.pessoa.estadoCivil >= 1 && this.pessoa.estadoCivil < 5 && !this.pessoa.dataCasamento)
        return this.serviceUtil.showMessage(`Para pesquisar o conjuge se faz necessário alterar o estado civil e informar a data de casamento.`, true);


      if (this.serviceUtil.ValidaCpf(this.pessoa.cpfConjuge)) {
        this.serverApi.readById(this.pessoa.cpfConjuge, Endpoint.BuscaPorCpf, '', this.auth.dadosUsuario.IgrejaLogada).subscribe(response => {
          if (response.code == 200) {
            this.pessoa.nomeConjuge = response.data.nome;
          } else
            this.serviceUtil.showMessage(`${response.mensagem}, verifique o cadastro da esposa antes de prosseguir.`, true)
        });
      }
    }
  }
  ValidarPessoa(): boolean {
    let result: boolean = false;
    this.pessoa.nome == undefined
      ? this.serviceUtil.showMessage("Dados Pessoais -> Nome Obrigatório") :
      this.pessoa.estadoCivil < 1 || this.pessoa.estadoCivil == undefined ? this.serviceUtil.showMessage("Selecione --> Estado Civil") :
        this.pessoa.dataNascimento == undefined ? this.serviceUtil.showMessage("Informe a --> Data nascimento ") :
          this.pessoa.grauInstrucao < 1 || this.pessoa.grauInstrucao == undefined ? this.serviceUtil.showMessage("Selecione --> Grau de Instrução") :
            this.pessoa.sexo < 1 || this.pessoa.sexo == undefined ? this.serviceUtil.showMessage("Selecione --> Sexo ") :
              this.pessoa.statusPessoa < 1 || this.pessoa.statusPessoa == undefined ? this.serviceUtil.showMessage("Selecione --> Situação ") :
                this.pessoa.naturalidade == undefined ? this.serviceUtil.showMessage("Informe --> Cidade onde nasceu") :
                  this.pessoa.naturalidadeEstado == undefined ? this.serviceUtil.showMessage("Informe --> Estado onde nasceu") :
                    this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.dataCasamento == undefined ? this.serviceUtil.showMessage("Informe a Data de Casamento.") :
                      this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.cpfConjuge == "" ? this.serviceUtil.showMessage("Informe o CPF do Cônjuje e pressione enter.") :
                        result = true
    return result;

  }

  ValidarEndereco(): boolean {
    let result: boolean = false;

    this.endereco.cep == undefined || this.endereco.cep == 0 ? this.serviceUtil.showMessage("Informe o --> CEP e Pressione Enter") :
      this.endereco.estado == undefined ? this.serviceUtil.showMessage("Informe --> Estado ") :
        this.endereco.cidade == undefined ? this.serviceUtil.showMessage("Informe --> Cidade ") :
          this.endereco.bairro == undefined ? this.serviceUtil.showMessage("Informe --> Bairro") :
            this.endereco.rua == undefined ? this.serviceUtil.showMessage("Informe --> Rua ") :
              this.endereco.numero == undefined ? this.serviceUtil.showMessage("Informe --> Nº Casa ") :
                result = true

    return result;
  }

  LimparCampoConjuge() {
    this.pessoa.cpfConjuge = this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 ? this.pessoa.cpfConjuge : "";
    this.pessoa.nomeConjuge = this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 ? this.pessoa.nomeConjuge : "";
    this.pessoa.dataCasamento = this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 ? this.pessoa.dataCasamento : undefined

  }


  ValidarDadosMembro(): boolean {
    let result: boolean = false;
    this.dadosMembro.rol == undefined ? this.serviceUtil.showMessage("Informe --> Nº Rol ") :
      this.dadosMembro.congregacao == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe a --> Congregação") :
        this.dadosMembro.regional == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe --> Regional") :
          this.dadosMembro.batismoAguas == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe a data de --> Batismo nas Águas") :
            this.dadosMembro.batismoAguasIgreja == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe a Igreja --> Batismo nas Águas") :
              this.dadosMembro.batismoAguasCidade == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe a Cidade --> Onde foi batizado") :
                this.dadosMembro.batismoAguasEstado == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe o Estado --> Onde foi batizado") :
                  this.dadosMembro.membroDesde == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe --> Membro Desde") :
                    this.dadosMembro.validadeCartaoMembro == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe a data --> Validade do cartão de Membro") :
                      this.dadosMembro.funcao == undefined && this.pessoa.id > 0 || this.dadosMembro.funcao < 1 && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Selecione a Função --> Função") :
                        this.dadosMembro.cursoTeologico > 0 && this.dadosMembro.cursoTeologicoOndeCursou == undefined && this.pessoa.id > 0 ? this.serviceUtil.showMessage("Informe onde cursou Teologia.") :
                          this.dadosMembro.funcao < this.funcaoMembroCache && this.pessoa.id > 0 ? this.serviceUtil.showMessage("A função não pode ser rebaixada") :
                            this.dadosMembro.funcao > this.funcaoMembroCache && this.dadosMembro.funcao - this.funcaoMembroCache > 1 ? this.serviceUtil.showMessage("Função Inválida deve ser adicionada uma por vez!.") :
                              this.dadosMembro.id == 0 && this.dadosMembro.funcao > 1 ? this.serviceUtil.showMessage("No Primeiro cadastro do Membro ele deve ser atribuido a função Membro.") :
                                result = true
    return result;
  }

  AlteraFuncao(aprovado: boolean, idHistorico: number = 0) {

    if (this.dadosMembro.funcao > 1 || aprovado && idHistorico > 0) {

      this.serviceUtil.Popup("Informar os dados", TipoPopup.ComponenteInstancia, HistoricoPopupComponent, idHistorico, 'auto', 'auto', false, aprovado)
        .subscribe(result => {

          if (result && result.Status) {
            this.historico = result.data

            if (this.dadosObreiro.id == 0) {
              this.dadosObreiro.id = 0;
              this.dadosObreiro.pessoaId = this.pessoa.id;

              if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
                return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

              this.serverApi.create(this.dadosObreiro, Endpoint.Obreiro)
                .subscribe(x => {
                  this.dadosObreiro = x;
                  this.historico.dadosObreiroId = x.id
                  this.AdicionarFuncaoObreiro();
                  this.serviceUtil.showMessage("Obreiro cadastrado com sucesso.", false)
                });

            } else {
              this.AdicionarFuncaoObreiro();
              this.serviceUtil.showMessage("Obreiro alterado com sucesso.", false)
            }

          } else {
            this.serviceUtil.showMessage("Informações ignoradas", false)

            this.dadosMembro.funcao = this.serviceUtil.Funcao().filter(x => x.id == this.funcaoMembroCache)[0].id
          }
        })
    }
  }

  public AtualizarFuncao(id: number, alterarfuncao: boolean = false): void {

    this.AlteraFuncao(alterarfuncao, id);
  }

  public ExcluirHistorico(id: number): void {

    if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
      return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

    this.serverApi.create(id, Endpoint.HistoricoObreiro + `/excluir/${id}`)
      .subscribe(() => {
        this.serviceUtil.showMessage("Histórico excluído com sucesso.");
        this.BuscarMembro();
      });
  }

  AlteraSituacao() {
    if (this.ValidarDadosMembro() && this.situacaoCache == 5 && this.pessoa.statusPessoa < 5 && this.pessoa.id > 0) {

      this.serviceUtil.Popup("Informe o Motivo da Reativação do Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
        .subscribe(result => {
          if (result.Status) {
            let guardaNome = this.pessoa.nome;
            this.pessoa.nome = result.Motivo;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
              return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

            this.serverApi.create(this.pessoa, Endpoint.Pessoa)
              .subscribe(response => {
                this.serviceUtil.showMessage("Membro Reativado com sucesso!.", false);
                this.pessoa.nome = guardaNome;
              })
          }
        },
          (error) => {
            this.serviceUtil.showMessage("Problema pra reativar o cadastro!.", false);
          });
    }
  }

  AdicionarFuncaoObreiro() {

    if (this.dadosObreiro.id > 0) {

      this.historico.dadosObreiroId = this.dadosObreiro.id;
      this.historico.funcao = this.dadosMembro.funcao;

      if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
        return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

      this.serverApi.create(this.historico, Endpoint.HistoricoObreiro)
        .subscribe(() => {
          this.BuscarMembro();
        })
    }
  }

  processFile(event: any) {

    this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
    this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

    if (event.target.files && event.target.files[0] && this.serviceUtil.ValidaCpf(this.pessoa.cpf)) {

      const file = <File>event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('image', file)

      this.serverApi.EnviarArquivoServidor(formData, Endpoint.UploadArquivo, this.pessoa.cpf, this.pessoa.id)
        .subscribe(x => {
          //event.target.files = undefined
          this.serviceUtil.showMessage("Imagem importada com sucesso!", false);
          this.BuscarMembro()
        })
    }
  }

  RemoverFoto(idPessoa: any) {
    this.serviceUtil.Popup("Deseja excluir a foto de perfil ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result.Status) {
          this.serverApi.readById(idPessoa, Endpoint.RemoverFotoperfil)
            .subscribe(() => {
              this.serviceUtil.showMessage("Imagem removida com sucesso!", false);
              this.BuscarMembro()
            })
        }
      },
        (error) => {
          this.serviceUtil.showMessage("Problema pra excluir a foto do usuário!.", false);
        });
  }

  BuscaCep(event: any) {
    try {
      if (event.which == 13) {

        this.servicoCep.buscarExterna(Endpoint.cep.replace('{0}', this.endereco.cep.toString().padStart(8, '0')))
          .subscribe(ret => {
            if (ret.logradouro != null) {
              this.endereco.estado = ret.uf
              this.endereco.cidade = ret.localidade
              this.endereco.bairro = ret.bairro
              this.endereco.rua = ret.logradouro
              this.endereco.complemento = ret.complemento
            }
            else {
              this.serviceUtil.showMessage("Não foi possível encontrar o CEP informado", false)
            }
          });
      }
    } catch (error) {
      this.serviceUtil.showMessage(`site do correio indisponível ${error}`, false)
    }
  }

  // public ValidaCpf(cpfEntrada: string): boolean {

  //   if (cpfEntrada) {

  //     let numeroCpf = ("00000000000" + cpfEntrada).slice(-11);

  //     if (!cpf.isValid(numeroCpf)) {
  //       this.serviceUtil.showMessage("Cpf Inválido", false)
  //       return false

  //     } else
  //       return true
  //   }
  //   else
  //     this.serviceUtil.showMessage("Informe o Cpf", false)
  //   return false
  // }

  AdicionarContato() {

    if (this.contato.ddd > 0) {
      this.contato.pessoaId = this.pessoa.id;
      this.contato.ddd = Number(this.contato.ddd.toString().length > 2 ? this.contato.ddd.toString().substring(0, 2) : this.contato.ddd)
      this.contato.telefone = Number(this.contato.telefone.toString().length > 9 ? this.contato.telefone.toString().substring(0, 9) : this.contato.telefone)
      this.contato.celular = Number(this.contato.celular.toString().length > 9 ? this.contato.celular.toString().substring(0, 9) : this.contato.celular)

      if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
        return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

      this.serverApi.create(this.contato, Endpoint.Contatos)
        .subscribe(x => {
          this.contato = new contatos()
          this.BuscarContatos()
        })
    } else
      this.serviceUtil.showMessage("informar os dados do contato.", false)


  }

  ExcluirContato(id: any) {

    let body = { id: id, acao: "excluir" };

    if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
      return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

    this.serverApi.create(body, Endpoint.Contatos + '/Excluir').subscribe(x => {
      this.serviceUtil.showMessage("Contato Excluido com sucesso!")
      this.BuscarContatos()
    });
  }

  EditarContato(id: any) {
    this.serverApi.readById(id, Endpoint.Contatos).subscribe(con => {
      this.contato = con.data
    })
  }


  BuscarContatos() {
    this.serverApi.read(Endpoint.Contatos)
      .subscribe(response => {
        this.contatos = response.filter(x => x.pessoaId == this.pessoa.id)
      })
  }


  ContatoSelecionado(id: any) {

  }

  AdicionarCargo() {

    if (this.cargo.cargo && this.cargo.noCargoDesde) {

      if (this.pessoa.id > 0) {
        this.cargo.pessoaId = this.pessoa.id;

        if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada)
          return this.serviceUtil.showMessage("Você só pode cadastrar ou alterar dados da sua igreja.");

        this.serverApi.create(this.cargo, Endpoint.Cargos)
          .subscribe(() => {
            this.cargo = new Cargos()
            this.serverApi.read(Endpoint.Cargos)
              .subscribe(cargos => {
                this.cargos = cargos.filter(x => x.pessoaId == this.pessoa.id)
              })
            this.serviceUtil.showMessage("Cargo Salvo com sucesso!. ", false)
          })
      }
    } else
      this.serviceUtil.showMessage("informar o cargo e a data do cargo ", false)
  }

  EditarCargo(id: any) {
    this.serverApi.readById(id.toString(), Endpoint.Cargos)
      .subscribe((result) => {
        this.cargo = result.data;
      })
  }

  CargoSelecionado(id: any) {
    this.cargoSelecionado = id
  }

  LogSelecionado(id: any) {
    this.logSelecionado = id
  }


  HistoricoSelecionado(id: any) {
    this.historicoSelecionado = id
  }

  AtualizarHistorico(id: any) {

  }
}
