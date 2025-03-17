import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { Cep } from 'src/app/models/Cep';
import { contatos } from 'src/app/models/contato';
import { igreja, TodasAsIgrejas } from 'src/app/models/Igreja';
import { Pessoa } from 'src/app/models/pessoa';
import { PessoaEndereco } from 'src/app/models/PessoaEndereco';
import { Contato, DadosMembro, Precadastro } from 'src/app/models/precadastro';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-cadastre-se',
  templateUrl: './cadastre-se.component.html',
  styleUrls: ['./cadastre-se.component.css']
})
export class CadastreSeComponent implements OnInit {


  Colunas = ['ddd', 'telefone', 'celular', 'email', 'action']

  igreja: igreja = new igreja();
  igrejas: TodasAsIgrejas[] = new Array();

  pessoa: Precadastro = new Precadastro();
  contato: Contato = new Contato();

  confirmar = false;

  fotoPerfil: string = ""

  sede: TodasAsIgrejas[] = new Array();
  subsede: TodasAsIgrejas[] = new Array();
  congregacoes: TodasAsIgrejas[] = new Array();

  sedeSelecionada: TodasAsIgrejas = new TodasAsIgrejas();
  subSedeSelecionada: TodasAsIgrejas = new TodasAsIgrejas();
  congregacaoSelecionada: TodasAsIgrejas = new TodasAsIgrejas();

  breadcrumbs = '';

  contatoSelecionado = 0

  step = 0;
  //combos
  estCivil: any[]
  instrucao: any[]
  statusPessoa: any[]
  sexo: any[]
  cursoTeoligico: any[]
  funcao: any[]
  spinner = false;

  constructor(
    private service: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private servicoCep: AllservicesService<Cep>,
    private dialogRef: MatDialogRef<CadastreSeComponent>
  ) { }


  ngOnInit(): void {

    this.CarregarCombos()
    this.setStep(0)
    this.BuscarSede()

    this.pessoa.pessoaEndereco = new PessoaEndereco();
    this.pessoa.contatos = new Array();
    this.pessoa.dadosMembro = new DadosMembro();
    this.confirmar = false;
    this.pessoa.dadosMembro.membroDesde = new Date();
    this.pessoa.dadosMembro.validadeCartaoMembro = new Date();
    this.pessoa.dadosMembro.comunhao = new Date();
  }


  CarregarCombos() {
    this.estCivil = this.service.EstCivil();
    this.instrucao = this.service.GrauInstrucao();
    this.statusPessoa = this.service.StatusPessoa();
    this.sexo = this.service.Sexo();
    this.cursoTeoligico = this.service.CursoTeologico();
    this.funcao = this.service.FuncaoTelaCadastro()
  }

  private BuscarSede(): void {
    this.confirmar = false
    this.serverApi.read(Endpoint.Token + `/igrejasMatrizes/`)
      .subscribe((result: TodasAsIgrejas[]) => {
        this.sede = result.filter(s => s.tipoIgreja === 1);
      })

  }

  public BuscarSubsede(igreja: TodasAsIgrejas): void {
    this.confirmar = false
    if (igreja.id > 0) {
      this.serverApi.read(Endpoint.Token + `/igrejasFilhas/${igreja.id}`)
        .subscribe((result: TodasAsIgrejas[]) => {
          this.subsede = result.filter(s => this.sedeSelecionada.id != s.id && s.tipoIgreja === 2);


          this.pessoa.statusPessoa = 0;
          this.pessoa.dadosMembro.congregacao =
            this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.nome :
              this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.nome :
                this.sedeSelecionada.id > 0 ? this.sedeSelecionada.nome : this.pessoa.dadosMembro.congregacao;

          this.pessoa.dadosMembro.regional =
            this.congregacaoSelecionada.id > 0 ? this.subSedeSelecionada.nome :
              this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.nome :
                this.pessoa.dadosMembro.regional

          this.pessoa.igrejaId =
            this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.id :
              this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.id :
                this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.id : this.pessoa.igrejaId
        })
    }
  }

  public BuscarCongregacoes(igreja: TodasAsIgrejas): void {
    this.confirmar = false
    if (igreja.id > 0) {
      this.serverApi.read(Endpoint.Token + `/igrejasFilhas/${igreja.id}`)
        .subscribe((result: TodasAsIgrejas[]) => {
          this.congregacoes = result.filter(s => this.sedeSelecionada.id != s.id && this.subSedeSelecionada.id != s.id && s.tipoIgreja === 3);

          this.pessoa.statusPessoa = 0;
          this.pessoa.dadosMembro.congregacao =
            this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.nome :
              this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.nome :
                this.sedeSelecionada.id > 0 ? this.sedeSelecionada.nome : this.pessoa.dadosMembro.congregacao;

          this.pessoa.dadosMembro.regional =
            this.congregacaoSelecionada.id > 0 ? this.subSedeSelecionada.nome :
              this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.nome :
                this.pessoa.dadosMembro.regional

          this.pessoa.igrejaId =
            this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.id :
              this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.id :
                this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.id : this.pessoa.igrejaId
        })
    }
  }

  FecharPopup() {
    this.service.Popup("Tem certeza que deseja fechar o Popup? se fechar todos os dados serão perdidos!", 0, PopupConfirmacaoComponent, 0, 'auto', 'auto', true, false, null, false)
      .subscribe(result => {
        if (result) {
          this.sedeSelecionada = new TodasAsIgrejas();
          this.subSedeSelecionada = new TodasAsIgrejas();
          this.congregacaoSelecionada = new TodasAsIgrejas();
          this.dialogRef.close();
        }
      })

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

  processFile(event: any) {

    this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
    this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

    if (event.target.files && event.target.files[0] && this.service.ValidaCpf(this.pessoa.cpf)) {

      const file = <File>event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('image', file)

      this.serverApi.EnviarArquivoServidor(formData, Endpoint.UploadArquivo, this.pessoa.cpf, this.pessoa.id)
        .subscribe(x => {
          event.target.files = undefined
          this.service.showMessage("Imagem importada com sucesso!", false);
          //this.BuscarMembro()
        })
    }
  }

  RemoverFoto(idPessoa: any) {
    this.service.Popup("Deseja excluir a foto de perfil ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result.Status) {
          this.serverApi.readById(idPessoa, Endpoint.RemoverFotoperfil)
            .subscribe(() => {
              this.service.showMessage("Imagem removida com sucesso!", false);
              // this.BuscarMembro()
            })
        }
      },
        (error) => {
          this.service.showMessage("Problema pra excluir a foto do usuário!.", false);
        });
  }


  Salvar(step: number) {

    this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
    this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

    if (!this.sedeSelecionada)
      return this.service.showMessage("Selecione a Sede!.", true);

    if (this.service.ValidaCpf(this.pessoa.cpf)) {

      this.pessoa.statusPessoa = 0;
      this.pessoa.dadosMembro.congregacao =
        this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.nome :
          this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.nome :
            this.sedeSelecionada.id > 0 ? this.sedeSelecionada.nome : this.pessoa.dadosMembro.congregacao;

      this.pessoa.dadosMembro.regional =
        this.congregacaoSelecionada.id > 0 ? this.subSedeSelecionada.nome :
          this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.nome :
            this.pessoa.dadosMembro.regional

      this.pessoa.igrejaId =
        this.congregacaoSelecionada.id > 0 ? this.congregacaoSelecionada.id :
          this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id > 0 ? this.subSedeSelecionada.id :
            this.congregacaoSelecionada.id === 0 && this.subSedeSelecionada.id === 0 ? this.sedeSelecionada.id : this.pessoa.igrejaId


      switch (step) {
        case 0:
          if (this.ValidarPessoa()) {
            this.pessoa.statusPessoa = 0;
            this.step++;
          }
          break;
        case 1:
          this.step++;
          break;
        case 2:
          if (this.pessoa.contatos.length == 0) {
            return this.service.showMessage("Cadastrar pelo menos um contato!.", false);
          }
          this.step++;
          break;
        case 3:

          if (this.ValidarDadosMembro()) {
            this.spinner = true;
            this.serverApi.create(this.pessoa, Endpoint.Token + `/precadastro/`)
              .subscribe((result: ApiResponse) => {
                if (result.code === 200) {
                  this.service.showMessage("Cadastro enviado com sucesso!.", false);

                  this.spinner = false;

                  //implementar a proxima tela envio de documentos
                  this.service.showMessage("Cadastro enviado com sucesso!.", false);
                  this.dialogRef.close();


                }
              }, (err) => {
                this.spinner = false;
                this.service.showMessage(`${err?.error?.message}`, false);
              })
          }
          break;
        default:
          break;
      }
    }
  }

  public BuscaCep(event: any) {
    try {
      if (event.which == 13 || event.which == 9 || event.which == 1) {

        this.servicoCep.buscarExterna(Endpoint.cep.replace('{0}', this.pessoa.pessoaEndereco.cep.toString().padStart(8, '0')))
          .subscribe(ret => {
            if (ret.logradouro != null) {
              this.pessoa.pessoaEndereco.estado = ret.uf
              this.pessoa.pessoaEndereco.cidade = ret.localidade
              this.pessoa.pessoaEndereco.bairro = ret.bairro
              this.pessoa.pessoaEndereco.rua = ret.logradouro
              this.pessoa.pessoaEndereco.complemento = ret.complemento
            }
            else {
              this.service.showMessage("Não foi possível encontrar o CEP informado", false)
            }
          });
      }
    } catch (error) {
      this.service.showMessage(`site do correio indisponível ${error}`, false)
    }
  }


  AdicionarContato() {

    if (this.contato.ddd > 0) {

      this.contato.ddd = Number(this.contato.ddd.toString().length > 2 ? this.contato.ddd.toString().substring(0, 2) : this.contato.ddd)
      this.contato.telefone = Number(this.contato.telefone.toString().length > 9 ? this.contato.telefone.toString().substring(0, 9) : this.contato.telefone)
      this.contato.celular = Number(this.contato.celular.toString().length > 9 ? this.contato.celular.toString().substring(0, 9) : this.contato.celular)

      this.pessoa.contatos.push(this.contato)
      this.pessoa.contatos = [...this.pessoa.contatos]
      this.contato = new Contato();

    } else
      this.service.showMessage("informar os dados do contato.", false)


  }

  RemoveContato(row: any) {
    this.pessoa.contatos.splice(row, 1)
    this.pessoa.contatos = [...this.pessoa.contatos]

  }

  ValidarPessoa(): boolean {
    let result: boolean = false;
    this.pessoa.nome == undefined ? this.service.showMessage("Dados Pessoais -> Nome Obrigatório") :
      this.pessoa.estadoCivil < 1 || this.pessoa.estadoCivil == undefined ? this.service.showMessage("Selecione --> Estado Civil") :
        this.pessoa.dataNascimento == undefined ? this.service.showMessage("Informe a --> Data nascimento ") :
          this.pessoa.grauInstrucao < 1 || this.pessoa.grauInstrucao == undefined ? this.service.showMessage("Selecione --> Grau de Instrução") :
            this.pessoa.sexo < 1 || this.pessoa.sexo == undefined ? this.service.showMessage("Selecione --> Sexo ") :
              this.pessoa.naturalidade == undefined ? this.service.showMessage("Informe --> Cidade onde nasceu") :
                this.pessoa.naturalidadeEstado == undefined ? this.service.showMessage("Informe --> Estado onde nasceu") :
                  this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.dataCasamento == undefined ? this.service.showMessage("Informe a Data de Casamento.") :
                    this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.cpfConjuge == "" ? this.service.showMessage("Informe o CPF do Cônjuje.") :
                      this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 && this.pessoa.nomeConjuge == "" ? this.service.showMessage("Informe o nome do Cônjuje.") :
                        this.pessoa.nomePai == undefined ? this.service.showMessage("Informe --> O nome do pai") :
                          this.pessoa.nomeMae == undefined ? this.service.showMessage("Informe --> O nome da mãe") :
                            result = true
    return result;

  }

  ValidarEndereco(): boolean {
    let result: boolean = false;

    this.pessoa.pessoaEndereco.cep == undefined || this.pessoa.pessoaEndereco.cep == 0 ? this.service.showMessage("Informe o --> CEP e Pressione Enter") :
      this.pessoa.pessoaEndereco.estado == undefined ? this.service.showMessage("Informe --> Estado ") :
        this.pessoa.pessoaEndereco.cidade == undefined ? this.service.showMessage("Informe --> Cidade ") :
          this.pessoa.pessoaEndereco.bairro == undefined ? this.service.showMessage("Informe --> Bairro") :
            this.pessoa.pessoaEndereco.rua == undefined ? this.service.showMessage("Informe --> Rua ") :
              this.pessoa.pessoaEndereco.numero == undefined ? this.service.showMessage("Informe --> Nº Casa ") :
                result = true

    return result;
  }

  LimparCampoConjuge() {
    this.pessoa.cpfConjuge = this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 ? this.pessoa.cpfConjuge : "";
    this.pessoa.nomeConjuge = this.pessoa.estadoCivil >= 2 && this.pessoa.estadoCivil < 5 ? this.pessoa.nomeConjuge : "";

  }

  ValidarDadosMembro(): boolean {

    let result: boolean = false;
    this.pessoa.dadosMembro.rol.toString() == '' ? this.service.showMessage("Informe --> Nº Rol caso não saiba deixe zero(0)") :
      this.pessoa.dadosMembro.congregacao == '' ? this.service.showMessage("Selecione --> a Congregação") :
        this.pessoa.dadosMembro.regional == '' ? this.service.showMessage("Informe --> Regional") :
          this.pessoa.dadosMembro.batismoAguas == undefined ? this.service.showMessage("Informe a data de --> Batismo nas Águas se for canditado informe a data que será batizado.") :
            this.pessoa.dadosMembro.batismoAguasIgreja == '' ? this.service.showMessage("Informe a Igreja --> que foi ou será batizado") :
              this.pessoa.dadosMembro.batismoAguasCidade == '' ? this.service.showMessage("Informe a Cidade --> que foi ou será batizado") :
                this.pessoa.dadosMembro.batismoAguasEstado == '' ? this.service.showMessage("Informe o Estado --> que foi ou será batizado") :
                  this.pessoa.dadosMembro.batismoESanto != undefined && this.pessoa.dadosMembro.batismoESantoIgreja == '' ? this.service.showMessage("Informe a igreja que foi batizado no espirito santo") :
                    this.pessoa.dadosMembro.cursoTeologico > 0 && this.pessoa.dadosMembro.cursoTeologicoOndeCursou == undefined ? this.service.showMessage("Informe onde cursou Teologia.") :
                      result = true
    return result;
  }

  ContatoSelecionado(id: any) {

  }

  public Confirmar(): void {


    let igreja = this.congregacaoSelecionada.nome
      ? this.congregacaoSelecionada.nome
      : this.subSedeSelecionada.nome
        ? this.subSedeSelecionada.nome
        : this.sedeSelecionada.nome ? this.sedeSelecionada.nome : '';

    igreja = igreja.toUpperCase()

    this.service.Popup(`O seu cadastro está sendo enviado à igreja " ${igreja} ",  Está correto? `,
      TipoPopup.Confirmacao, PopupConfirmacaoComponent,
      0,
      'auto',
      'auto',
      true,
      false,
      null,
      false)
      .subscribe(result => {
        if (result.Status) {
          if (this.sedeSelecionada)
            this.confirmar = true;
        }
      })
  }

  public MudarIgreja(): void {
    this.confirmar = false;
    this.sedeSelecionada = new TodasAsIgrejas();
    this.subSedeSelecionada = new TodasAsIgrejas();
    this.congregacaoSelecionada = new TodasAsIgrejas();

    this.subsede = new Array();
    this.congregacoes = new Array();

    this.breadcrumbs = '';
  }

}
