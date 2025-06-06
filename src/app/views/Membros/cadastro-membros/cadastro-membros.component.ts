import { TipoRelatorio } from './../../../enum/TipoRelatorio';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Cep } from 'src/app/models/Cep';
import { DadosMembro } from 'src/app/models/DadosMembro';
import { PessoaEndereco } from 'src/app/models/PessoaEndereco';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { cpf } from 'cpf-cnpj-validator';
import { contatos } from 'src/app/models/contato';
import { Cargos } from 'src/app/models/Cargos';
import { Historico } from 'src/app/models/HistoricoDoObreiro';
import { DadosObreiro } from 'src/app/models/DadosObreiro';
import { Filtros } from 'src/app/models/Filtros';
import { Logs } from 'src/app/models/Logs';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { HistoricoPopupComponent } from '../historico-popup/historico-popup.component';
import { igreja } from 'src/app/models/Igreja';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { ViewFilhos } from '../../filhos-membros/model/viewFilhos';
import { ViewDocumentos } from '../model/viewDocumentos';
import { ToastrService } from 'ngx-toastr';
import { CadastroDocumentosPessoaisComponent } from '../Modal/documentos-pessoais/cadastro-documentos-pessoais/cadastro-documentos-pessoais.component';
import { TipoDocumento } from 'src/app/enum/TipoDocumento';
import { PopupcomponetComponent } from 'src/app/popups/popupcomponet/popupcomponet.component';

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
  dadosObreiro: DadosObreiro = new DadosObreiro();
  fotoPerfil: string = ""
  cargos: Cargos[] = new Array()
  cargo: Cargos = new Cargos();
  funcaoMembroCache: number = 1;
  cursoTeologicoCache: number = 1;
  historico: Historico = new Historico()
  foto: FormData = new FormData()
  filtros: Filtros = new Filtros()
  logs: Logs[] = new Array()
  documentos: ViewDocumentos[] = new Array();
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
  ColunasHistoricoObreiro = ['id', 'pastorApresentador', 'pastorRegional', 'local', 'funcao', 'entradaFuncao', 'dataEntradaFuncao', 'dataSaidaFuncao', 'reintegrado', 'reintegradoEm', 'aprovado', 'observacao', 'action']
  colunasLogs = ['data', 'descricao']
  colunasDocumentos = ['id', 'data', 'descricao', 'tipoDocumento', 'action']
  cpfbloqueado = false;
  igrejas: any
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
    private auth: AutenticacaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {

    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.auth.dadosUsuario.IgrejaSelecionada === 0 ?
      this.auth.dadosUsuario.IgrejaLogada : this.auth.dadosUsuario.IgrejaSelecionada;
    this.cpfbloqueado = this.auth.dadosUsuario.TipoUsuarioLogado > 1 ? true : false;
    this.CarregarCombos()
    this.setStep(0)
    this.BuscarMembro()
    this.BuscarIgrejas()

  }

  ngOnDestroy(): void {
    this.serverApi;
    console.log()
  }


  BuscarMembro() {

    const id = Number(this.serverApi.idMembro.getValue());

    if (id > 0) {
      this.fotoPerfil = "";

      this.serverApi.readById(id.toString(), Endpoint.Pessoa)
        .subscribe((result) => {
          this.pessoa = result;
          this.situacaoCache = this.pessoa?.statusPessoa
          this.fotoPerfil = this.pessoa.fotoCadastrada ? `./assets/imagens/${this.pessoa.id}_${this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11)}.jpg? + ${new Date().getTime()}` : `./assets/imagens/sem-foto.jpg`
          this.idade = this.serviceUtil.SubtractYears(this.pessoa.dataNascimento ? this.pessoa.dataNascimento : new Date)
          this.idadeCasado = this.serviceUtil.SubtractYears(this.pessoa.dataCasamento ? this.pessoa.dataCasamento : new Date)
          this.spinner = false;
        }, (err) => {
          this.spinner = false;
        });
    }
  }

  BuscarIgrejas() {
    if (!this.cpfbloqueado) {
      this.serverApi.read(Endpoint.Igreja + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
        .subscribe(result => {
          this.igrejas = result
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
    switch (index) {

      case 0:

        if (this.pessoa.id > 0) {
          this.spinner = true;
          this.BuscarMembro();
        }
        break;

      case 1:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.readById(this.pessoa.id.toString(), Endpoint.Enderecos + `/pessoa`)
            .subscribe((result) => {
              this.endereco = result && result.id > 0 ? result : this.endereco = new PessoaEndereco();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }
        break;

      case 3:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.readById(this.pessoa.id.toString(), Endpoint.Membros + `/pessoa`)
            .subscribe((result) => {
              this.dadosMembro = result && result.id > 0 ? result : this.dadosMembro = new DadosMembro();
              this.funcaoMembroCache = this.dadosMembro.funcao;
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }
        break;

      case 2:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.read(Endpoint.Contatos + `?PessoaId=${this.pessoa.id}`)
            .subscribe((result) => {
              this.contatos = result && result.length > 0 ? result : this.contatos = new Array();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }
        break;
      case 4:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.BuscarInformacoesObreiro()
            .subscribe(result => {
              this.dadosObreiro = result.data && result.data.id > 0 ? result.data : new DadosObreiro();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }

        break;

      case 5:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.read(Endpoint.Cargos + `?PessoaId=${this.pessoa.id}`)
            .subscribe((result) => {
              this.cargos = result && result.length > 0 ? result : this.cargos = new Array();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }

        break;


      case 6:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.read(Endpoint.Logs + `?PessoaId=${this.pessoa.id}`)
            .subscribe((result) => {
              this.logs = result && result.length > 0 ? result : this.logs = new Array();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }

        break;


      case 7:

        if (this.pessoa.id > 0) {
          this.spinner = true;

          this.serverApi.read(Endpoint.DocumentosPessoais + `/estabelecimento/${this.pessoa.id}`)
            .subscribe((result: ViewDocumentos[]) => {
              this.documentos = result && result.length > 0 ? result : this.documentos = new Array();
              this.spinner = false;
            }, (err) => {
              this.spinner = false;
            });
        }

        break;

      default:
        break;
    }
  }


  private BuscarInformacoesObreiro() {
    return this.serverApi.readById(this.pessoa.id.toString(), Endpoint.Obreiro + `/pessoa`)
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

          if (this.ValidarPessoa() && this.pessoa.id == 0) {

            this.spinner = true;

            this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', this.igrejaSelecionada).subscribe(response => {
              if (response.code != 200) {
                this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
                this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
                this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
                this.pessoa.igrejaId = Number(this.igrejaSelecionada)
                //salvar dados de Pessoa
                if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2) {
                  this.spinner = false;
                  this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.")
                }


                this.serverApi.create(this.pessoa, Endpoint.Pessoa,).subscribe(x => {
                  this.step++;

                  this.pessoa = x

                  this.serverApi.readById(this.auth.dadosUsuario.IgrejaLogada.toString(), Endpoint.Igreja + `/regional`, '', 0)
                    .subscribe(response => {
                      this.dadosMembro.congregacao = response.congregacao;
                      this.dadosMembro.regional = response.regional;
                      let res = response;
                    })
                  this.spinner = false;
                  this.toast.success("Cadastro realizado")
                });

              } else {
                this.spinner = false;
                const igreja = response?.data?.nome?.split(';');
                this.toast.warning(`Já existe cadastro para o CPF informado : ${this.pessoa.cpf} Nome: ${igreja[0]} ${igreja[1]} `)
              }

            }, (err) => {
              this.spinner = false;
            });
          }
          else {

            this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
            this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento

            if (this.ValidarPessoa()) {

              this.spinner = true;

              if (this.auth.dadosUsuario.IgrejaLogada != this.pessoa.igrejaId && this.auth.dadosUsuario.TipoUsuarioLogado === 2) {
                this.spinner = false;
                return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.")
              }

              this.serverApi.create(this.pessoa, Endpoint.Pessoa,)
                .subscribe(x => {
                  this.spinner = false;
                  this.step++;
                  this.pessoa = x
                  this.toast.success(`Dados atualizados`)

                }, (err) => {
                  this.spinner = false;
                });
            }
          }
          break;
        case 1:

          if (this.ValidarEndereco() && this.pessoa.id > 0) {
            this.spinner = true;
            this.endereco.pessoaId = this.pessoa.id;

            //Salvar Endereço
            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2) {
              this.spinner = false;
              return this.toast.warning(`Você só pode cadastrar ou alterar dados da sua igreja.`)
            };

            this.serverApi.create(this.endereco, Endpoint.Enderecos)
              .subscribe(x => {
                this.endereco = x
                this.spinner = false;
                this.step++
                this.toast.success("Endereço salvo");
              }, (err) => {
                this.spinner = false;
              })
          }

          break;
        case 2:
          this.step++
          break

        case 3:

          if (this.ValidarDadosMembro() && this.pessoa.id > 0) {
            this.spinner = true;
            this.dadosMembro.pessoaId = this.pessoa.id;

            if (this.dadosMembro.id === 0)
              this.dadosMembro.funcao = 1;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2) {
              this.spinner = false;
              return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");
            }

            this.serverApi.readById(this.auth.dadosUsuario.IgrejaLogada > 0 ? this.auth.dadosUsuario.IgrejaLogada.toString() : this.pessoa.igrejaId.toString(), Endpoint.Igreja + `/regional`, '', 0)
              .subscribe(response => {
                this.dadosMembro.congregacao = response.congregacao ? response.congregacao : this.dadosMembro.congregacao;
                this.dadosMembro.regional = response.regional ? response.regional : this.dadosMembro.regional;

                this.serverApi.create(this.dadosMembro, Endpoint.Membros)
                  .subscribe(x => {
                    this.dadosMembro = x
                    this.spinner = false;
                    this.step++
                  }, (err) => {
                    this.spinner = false;
                  })

              });
          }
          break;

        case 4:

          if (this.pessoa.id > 0) {
            this.spinner = true;

            this.dadosObreiro.pessoaId = this.pessoa.id;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2) {
              this.spinner = false;
              return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");
            }

            this.serverApi.create(this.dadosObreiro, Endpoint.Obreiro)
              .subscribe(x => {
                this.dadosObreiro = x;
                this.spinner = false;
                this.toast.success("Dados de obreiro salvo com suecsso!");
              }, (err) => {
                this.spinner = false;
              });
          }
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
        return this.toast.warning(`O CPF informado é mesmo da pessoa ${this.pessoa.nome}.`);

      if (this.pessoa.estadoCivil >= 1 && this.pessoa.estadoCivil < 5 && !this.pessoa.dataCasamento)
        return this.toast.warning(`Para pesquisar o conjuge se faz necessário alterar o estado civil e informar a data de casamento.`);


      if (this.serviceUtil.ValidaCpf(this.pessoa.cpfConjuge)) {
        this.serverApi.readById(this.pessoa.cpfConjuge, Endpoint.BuscaPorCpf, '', this.auth.dadosUsuario.IgrejaLogada).subscribe(response => {
          if (response.code == 200) {
            this.pessoa.nomeConjuge = response.data.nome;
          } else
            this.toast.warning(`${response.mensagem}, verifique o cadastro da esposa antes de prosseguir.`)
        });
      }
    }
  }
  ValidarPessoa(): boolean {
    let result: boolean = false;
    this.pessoa.nome == undefined
      ? this.toast.warning("Dados Pessoais -> Nome Obrigatório") :
      this.pessoa.estadoCivil < 1 || this.pessoa.estadoCivil == undefined ? this.toast.warning("Selecione --> Estado Civil") :
        this.pessoa.dataNascimento == undefined ? this.toast.warning("Informe a --> Data nascimento ") :
          this.pessoa.grauInstrucao < 1 || this.pessoa.grauInstrucao == undefined ? this.toast.warning("Selecione --> Grau de Instrução") :
            this.pessoa.sexo < 1 || this.pessoa.sexo == undefined ? this.toast.warning("Selecione --> Sexo ") :
              this.pessoa.statusPessoa < 1 || this.pessoa.statusPessoa == undefined ? this.toast.warning("Selecione --> Situação ") :
                this.pessoa.naturalidade == undefined ? this.toast.warning("Informe --> Cidade onde nasceu") :
                  this.pessoa.naturalidadeEstado == undefined ? this.toast.warning("Informe --> Estado onde nasceu") :
                    this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.dataCasamento == undefined ? this.toast.warning("Informe a Data de Casamento.") :
                      this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.cpfConjuge == "" ? this.toast.warning("Informe o CPF do Cônjuje e pressione enter.") :
                        this.pessoa.nomePai == undefined ? this.toast.warning("Informe --> O nome do pai") :
                          this.pessoa.nomeMae == undefined ? this.toast.warning("Informe --> O nome da mãe") :
                            result = true
    return result;

  }

  ValidarEndereco(): boolean {
    let result: boolean = false;

    this.endereco.cep == undefined || this.endereco.cep == 0 ? this.toast.warning("Informe o --> CEP e Pressione Enter") :
      this.endereco.estado == undefined ? this.toast.warning("Informe --> Estado ") :
        this.endereco.cidade == undefined ? this.toast.warning("Informe --> Cidade ") :
          this.endereco.bairro == undefined ? this.toast.warning("Informe --> Bairro") :
            this.endereco.rua == undefined ? this.toast.warning("Informe --> Rua ") :
              this.endereco.numero == undefined ? this.toast.warning("Informe --> Nº Casa ") :
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
    this.dadosMembro.rol == undefined ? this.toast.warning("Informe --> Nº Rol ") :
      this.dadosMembro.batismoAguas == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe a data de --> Batismo nas Águas") :
        this.dadosMembro.batismoAguasIgreja == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe a Igreja --> Batismo nas Águas") :
          this.dadosMembro.batismoAguasCidade == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe a Cidade --> Onde foi batizado") :
            this.dadosMembro.batismoAguasEstado == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe o Estado --> Onde foi batizado") :
              this.dadosMembro.membroDesde == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe --> Membro Desde") :
                this.dadosMembro.validadeCartaoMembro == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe a data --> Validade do cartão de Membro") :
                  this.dadosMembro.funcao == undefined && this.pessoa.id > 0 || this.dadosMembro.funcao < 1 && this.pessoa.id > 0 ? this.toast.warning("Selecione a Função --> Função") :
                    this.dadosMembro.cursoTeologico > 0 && this.dadosMembro.cursoTeologicoOndeCursou == undefined && this.pessoa.id > 0 ? this.toast.warning("Informe onde cursou Teologia.") :
                      this.dadosMembro.funcao < this.funcaoMembroCache && this.pessoa.id > 0 ? this.toast.warning("A função não pode ser rebaixada") :
                        this.dadosMembro.funcao > this.funcaoMembroCache && this.dadosMembro.funcao - this.funcaoMembroCache > 1 ? this.toast.warning("Função Inválida deve ser adicionada uma por vez!.") :
                          this.dadosMembro.id == 0 && this.dadosMembro.funcao > 1 ? this.toast.warning("No Primeiro cadastro do Membro ele deve ser atribuido a função Membro.") :
                            result = true
    return result;
  }

  public AlteraFuncao(aprovado: boolean, idHistorico: number = 0): void {

    if (this.dadosMembro.funcao > 1 || aprovado && idHistorico > 0) {

      this.serviceUtil.Popup("Informar os dados", TipoPopup.ComponenteInstancia, HistoricoPopupComponent, idHistorico, 'auto', 'auto', false, aprovado)
        .subscribe(result => {

          if (result && result.Status) {
            this.historico = result.data

            this.BuscarInformacoesObreiro()
              .subscribe(result => {

                if (result.code == 404) {
                  this.dadosObreiro.id = 0;
                  this.dadosObreiro.pessoaId = this.pessoa.id;

                  if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
                    return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

                  this.serverApi.create(this.dadosObreiro, Endpoint.Obreiro)
                    .subscribe(x => {
                      this.dadosObreiro = x;
                      this.historico.dadosObreiroId = x.id
                      this.AdicionarFuncaoObreiro(this.dadosObreiro.id);
                      this.toast.success("Obreiro cadastrado com sucesso.")

                    });

                } else {
                  this.AdicionarFuncaoObreiro(result.data.id);
                  this.toast.success("Obreiro alterado com sucesso.")

                }


              });
          } else {
            this.toast.warning("Informações ignoradas")

            this.dadosMembro.funcao = this.serviceUtil.Funcao().filter(x => x.id == this.funcaoMembroCache)[0].id
          }
        })
    }
  }

  public AtualizarFuncao(id: number, alterarfuncao: boolean = false): void {

    this.AlteraFuncao(alterarfuncao, id);
  }

  public ExcluirHistorico(id: number): void {

    this.serviceUtil.Popup("Informe o Motivo do obreiro não ter sido aprovado ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result.Status) {

          if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
            return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

          if (result.Motivo.trim().length < 5)
            return this.toast.warning("O Motivo precisa ter pelo menos 5 letras.");

          const request = {
            id: id,
            acao: result.Motivo
          }
          this.serverApi.create(request, Endpoint.HistoricoObreiro + `/excluir`)
            .subscribe(() => {
              this.toast.success("Histórico cancelado com sucesso.");
              this.setStep(4);
            });

        }
      },
        (error) => {
          this.toast.error("Problema pra cancelar o histórico!.");
        });
  }

  public ExibirMotivoRejeicao(motivoRejeicao: any) {

    if (!motivoRejeicao)
      return;

    this.serviceUtil
      .Popup(`Motivo da rejeição: ${motivoRejeicao}`, TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, null, false);
  }

  AlteraSituacao() {

    if (this.ValidarPessoa() && this.situacaoCache == 5 && this.pessoa.statusPessoa < 5 && this.pessoa.id > 0) {

      this.serviceUtil.Popup("Informe o Motivo da Reativação do Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
        .subscribe(result => {
          if (result.Status) {
            let guardaNome = this.pessoa.nome;
            this.pessoa.nome = result.Motivo;

            if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
              return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

            this.serverApi.create(this.pessoa, Endpoint.Pessoa)
              .subscribe(response => {
                this.toast.success("Membro Reativado com sucesso!.");
                this.pessoa.nome = guardaNome;
              })
          }
        },
          (error) => {
            this.toast.error("Problema pra reativar o cadastro!.");
          });
    }
  }

  AdicionarFuncaoObreiro(idObreiro: number) {

    if (idObreiro > 0) {

      this.historico.dadosObreiroId = idObreiro;
      this.historico.funcao = this.dadosMembro.funcao;

      if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
        return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

      this.serverApi.create(this.historico, Endpoint.HistoricoObreiro)
        .subscribe(() => {
          this.setStep(4);
        })
    }
  }

  ImportarFotoPerfil(event: any) {

    this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
    this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

    if (event.target.files && event.target.files[0] && this.serviceUtil.ValidaCpf(this.pessoa.cpf)) {

      const file = <File>event.target.files[0];

      switch (file.type) {
        case 'image/jpeg':
        case 'image/jpg':
          break;

        default:
          return this.toast.warning("Enviar apenas arquivo JPG e JPEG");
      }

      const formData: FormData = new FormData();
      formData.append('file', file)

      const header = {
        idpessoa: this.pessoa.id,
        iddocumento: 0,
        tipodocumento: 0
      }

      this.serverApi.EnviarArquivoServidor(formData, Endpoint.UploadFiles, header)
        .subscribe((result) => {
          this.toast.success("Imagem importada com sucesso!");
          this.BuscarMembro();
        })
    }
  }


  public CapturarFoto(textoImagem: any): void {

    this.serviceUtil.Popup(textoImagem, TipoPopup.Confirmacao, PopupcomponetComponent, 0, 'auto', 'auto', false, false, false)
      .subscribe(result => {
        if (result) {

          let blob = this.serviceUtil.ConverterUriImagemBlob(result.imageAsDataUrl)

          const formData: FormData = new FormData();
          formData.append('file', blob)

          const header = {
            idpessoa: this.pessoa.id,
            iddocumento: 0,
            tipodocumento: 0
          }
          this.serverApi.EnviarArquivoServidor(formData, Endpoint.UploadFiles, header)
            .subscribe((result) => {
              this.toast.success("Imagem importada com sucesso!");
              this.BuscarMembro();
            })
        }
      },
        (error) => {
          this.toast.error("Problema pra excluir a foto do usuário!.");
        });

  }


  RemoverFoto(idPessoa: any) {
    this.serviceUtil.Popup("Deseja excluir a foto de perfil ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, null, false)
      .subscribe(result => {
        if (result.Status) {
          this.serverApi.create(idPessoa, Endpoint.RemoverFotoDocumento)
            .subscribe(() => {
              this.toast.success("Imagem removida com sucesso!");
              this.BuscarMembro()
            })
        }
      },
        (error) => {
          this.toast.error("Problema pra excluir a foto do usuário!.");
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
              this.toast.warning("Não foi possível encontrar o CEP informado")
            }
          });
      }
    } catch (error) {
      this.toast.error(`site do correio indisponível ${error}`)
    }
  }

  // public ValidaCpf(cpfEntrada: string): boolean {

  //   if (cpfEntrada) {

  //     let numeroCpf = ("00000000000" + cpfEntrada).slice(-11);

  //     if (!cpf.isValid(numeroCpf)) {
  //       this.toast.warning("Cpf Inválido", false)
  //       return false

  //     } else
  //       return true
  //   }
  //   else
  //     this.toast.warning("Informe o Cpf", false)
  //   return false
  // }

  AdicionarContato() {

    if (this.contato.ddd > 0) {
      this.contato.pessoaId = this.pessoa.id;
      this.contato.ddd = Number(this.contato.ddd.toString().length > 2 ? this.contato.ddd.toString().substring(0, 2) : this.contato.ddd)
      this.contato.telefone = Number(this.contato.telefone.toString().length > 9 ? this.contato.telefone.toString().substring(0, 9) : this.contato.telefone)
      this.contato.celular = Number(this.contato.celular.toString().length > 9 ? this.contato.celular.toString().substring(0, 9) : this.contato.celular)


      if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
        return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

      this.serverApi.create(this.contato, Endpoint.Contatos)
        .subscribe(x => {
          this.contato = new contatos()
          this.toast.success(`${this.contato.id === 0 ? 'Contato adicionado com sucesso.' : 'Contato alterado com sucesso.'} `)
          this.setStep(2)
        })
    } else
      this.toast.warning("informar os dados do contato.")


  }

  ExcluirContato(id: any) {

    let body = { id: id, acao: "excluir" };

    if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
      return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");


    this.serviceUtil.Popup("Deseja excluir o contato ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, null, false)
      .subscribe(result => {
        if (result.Status) {

          this.serverApi.create(body, Endpoint.Contatos + '/Excluir').subscribe(x => {
            this.toast.success("Contato Excluido com sucesso!")
            this.setStep(2)
          });
        }
      },
        (error) => {
          this.toast.error('Problema pra excluir a foto do usuário!.');
        });
  }

  EditarContato(id: any) {
    this.serverApi.readById(id, Endpoint.Contatos).subscribe(con => {
      this.contato = con.data
    })
  }


  ContatoSelecionado(id: any) {

  }

  AdicionarCargo() {

    if (this.cargo.cargo && this.cargo.noCargoDesde) {

      if (this.pessoa.id > 0) {
        this.cargo.pessoaId = this.pessoa.id;

        if (this.auth.dadosUsuario.IgrejaLogada != this.igrejaSelecionada && this.auth.dadosUsuario.TipoUsuarioLogado === 2)
          return this.toast.warning("Você só pode cadastrar ou alterar dados da sua igreja.");

        this.serverApi.create(this.cargo, Endpoint.Cargos)
          .subscribe(() => {
            this.cargo = new Cargos()
            this.setStep(5);
            this.toast.success("Cargo Salvo com sucesso!. ")
          })
      }
    } else
      this.toast.warning("informar o cargo e a data do cargo ")
  }

  public RemoverDocumento(id: number): void {

    this.serviceUtil.Popup("Deseja excluir a Documento ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, null, false)
      .subscribe(result => {
        if (result.Status) {

          this.serverApi.create(id, Endpoint.DocumentosPessoais + `/excluir`)
            .subscribe(result => {
              this.toast.success('Documento Excluído com sucesso!');
              this.setStep(7);
            }, (err) => {
              this.toast.success(`Erro ao Excluir o documento ${err.error.message}`);
            })
        }
        else
          this.toast.warning('Solicitação ignorada!');
      },
        (error) => {
          this.toast.error('Problema pra excluir a foto do usuário!.');
        });
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

  public AdicionarNovoDocumento(): void {

    const request = {
      Origem: 'U',
      PessoaId: this.pessoa.id,
      IdDocumento: 0,
      PessoaNome: this.pessoa.nome,
      PessoaCpf: this.pessoa.cpf
    }

    this.serviceUtil.Popup("", TipoPopup.cadastro, CadastroDocumentosPessoaisComponent, 0, 'auto', 'auto', false, false, request, false)
      .subscribe(result => {
        this.setStep(7);
      });
  }

  public EditarDocumento(id: number): void {
    const request = {
      PessoaId: this.pessoa.id,
      IdDocumento: id,
      PessoaNome: this.pessoa.nome,
      PessoaCpf: this.pessoa.cpf
    }

    this.serviceUtil.Popup("", TipoPopup.cadastro, CadastroDocumentosPessoaisComponent, 0, 'auto', 'auto', false, false, request, false)
      .subscribe(() => {
        this.setStep(7);
      });
  }

  public Imprimir(row: any): void {

    let filtros: Filtros = new Filtros();
    filtros.txtBusca = row.nomeArqFisico;

    this.serverApi.DownloadArquivo(TipoRelatorio.TipoDucumentoPessoal.toString(), Endpoint.DownloadArquivo, "", JSON.stringify(filtros))
      .subscribe(result => {

        this.serviceUtil.Imprimir(result, 'application/pdf')
      }, (err) => {
        this.toast.error('Erro ao baixar arquivo!.' + err.message);
      });
  }
}
