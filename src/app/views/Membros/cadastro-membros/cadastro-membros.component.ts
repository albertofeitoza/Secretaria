import { Component, ViewChild } from '@angular/core';
import { empty, find, identity, min } from 'rxjs';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Cep } from 'src/app/models/Cep';
import { DadosMembro } from 'src/app/models/DadosMembro';
import { PessoaEndereco } from 'src/app/models/PessoaEndereco';
import { Usuario } from 'src/app/models/Usuario';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { cpf } from 'cpf-cnpj-validator';
import { contatos } from 'src/app/models/contato';
import { Cargos } from 'src/app/models/Cargos';
import { Historico } from 'src/app/models/HistoricoDoObreiro';
import { DadosObreiro } from 'src/app/models/DadosObreiro';
import { MinValidator } from '@angular/forms';
import { MAT_DATEPICKER_VALIDATORS } from '@angular/material/datepicker';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-cadastro-membros',
  templateUrl: './cadastro-membros.component.html',
  styleUrls: ['./cadastro-membros.component.css']
})

export class CadastroMembrosComponent {

  selectedFile: ImageSnippet;

  // @ViewChild('fileInput') fileInput;
  contatoSelecionado = 0
  cargoSelecionado = 0
  historicoSelecionado = 0
  step = 0;
  pessoa: Pessoa = new Pessoa();
  endereco: PessoaEndereco = new PessoaEndereco();
  dadosMembro: DadosMembro = new DadosMembro();
  dadosObreiro: DadosObreiro = new DadosObreiro()

  cargos: Cargos[] = new Array()
  cargo: Cargos = new Cargos();

  historicos: Historico[] = new Array()
  historico: Historico = new Historico()
  foto: FormData = new FormData()


  //--------------
  contatos: contatos[] = new Array()
  contato: contatos = new contatos();

  Colunas = ['id', 'ddd', 'telefone', 'celular', 'email', 'action']
  ColunasCargos = ['id', 'cargo', 'noCargoDesde', 'noCargoAte', 'action']
  ColunasObreiro = ['id', 'funcao', 'entradaFuncao', 'dataEntradaFuncao', 'dataSaidaFuncao', 'reintegrado', 'reintegradoEm', 'aprovado', 'action']
  // ----------------

  //combos
  estCivil: any[]
  instrucao: any[]
  statusPessoa: any[]
  sexo: any[]
  cursoTeoligico: any[]
  funcao: any[]
  entradaFuncao: any[]

  constructor(
    private serviceUtil: UtilServiceService,
    private serviceCadastro: AllservicesService<Pessoa>,
    private servicoCep: AllservicesService<Cep>,

  ) { }

  ngOnInit() {
    this.CarregarCombos()
    this.setStep(0)


  }

  CarregarCombos() {
    this.estCivil = this.serviceUtil.EstCivil();
    this.instrucao = this.serviceUtil.GrauInstrucao();
    this.statusPessoa = this.serviceUtil.StatusPessoa();
    this.sexo = this.serviceUtil.Sexo();
    this.cursoTeoligico = this.serviceUtil.CursoTeologico();
    this.funcao = this.serviceUtil.Funcao()
    this.entradaFuncao = this.serviceUtil.EntradaFuncao()
    this.pessoa.dataNascimento = new Date('1901-01-01')
    this.pessoa.dataCasamento = new Date('1901-01-01')

  }

  setStep(index: number) {
    this.step = index;
  }

  Proximo() {
    if (this.step == 4) {
      this.Salvar()
      this.step++;
    } else
      this.step++;
  }

  Voltar() {
    this.step--;
  }

  Salvar() {

    if (this.ValidaCpf()) {

      if (this.ValidaCadastro()) {

        this.serviceCadastro.read(Endpoint.Pessoa).subscribe(x => {

          
          
          if (!x.map(p => p.cpf).includes(this.pessoa.cpf.toString())) {
            this.pessoa.dataCriacao = new Date
            this.endereco.dtCriacao = new Date
            this.pessoa.pessoaEndereco = this.endereco;
            this.pessoa.contatos = this.contatos
            this.pessoa.dadosMembro = this.dadosMembro
            this.pessoa.dadosMembro.cargos = this.cargos
            this.pessoa.dadosObreiro = this.dadosObreiro

            this.pessoa.cpf = this.pessoa.cpf.toString()
            this.pessoa.rg = this.pessoa.rg.toString()


            if (this.historico.entradaFuncao == 4) {
              this.historico.reintegrado = true
              this.historico.reintegradoEm = new Date
            }
            else
              this.historico.reintegrado = false

            this.historicos.push(this.historico)
            this.pessoa.dadosObreiro.historico = this.historicos

            //Salvando novo cadastro.
            this.serviceCadastro.create(this.pessoa, Endpoint.Pessoa,).subscribe(x => {
              this.serviceUtil.showMessage("cadastro realizado");
            });

          } else
            this.serviceUtil.showMessage(`Já existe cadastro para esse CPF`, true)
        });
      }

    }

  }

  processFile(event: any) {

    if (event.target.files && event.target.files[0]) {
      const arquivo = <File>event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('image', arquivo)
      this.foto = formData
    }
  }

  BuscaCep(event: any) {
    if (event.which == 13) {
      this.servicoCep.buscarExterna(Endpoint.cep.replace('{0}', this.endereco.cep.toString().padStart(8, '0'))).subscribe(ret => {
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
  }

  ValidaCpf(): boolean {

    if (this.pessoa.cpf) {
      if (!cpf.isValid(this.pessoa.cpf.toString())) {
        this.serviceUtil.showMessage("Cpf Inválido", false)
        return false

      } else
        return true
    }
    else
      this.serviceUtil.showMessage("Informe o Cpf", false)
    return false
  }



  ValidaCadastro(): boolean {
    let result: boolean = false;
    this.pessoa.nome == undefined
      ? this.serviceUtil.showMessage("Dados Pessoais -> Nome Obrigatório") :
      this.pessoa.estadoCivil < 1 || this.pessoa.estadoCivil == undefined ? this.serviceUtil.showMessage("Selecione --> Estado Civil") :
        this.pessoa.dataNascimento == undefined || this.pessoa.dataNascimento.toDateString() == "Mon Dec 31 1900" ? this.serviceUtil.showMessage("Informe a --> Data nascimento ") :
          this.pessoa.grauInstrucao < 1 || this.pessoa.grauInstrucao == undefined ? this.serviceUtil.showMessage("Selecione --> Grau de Instrução") :
            this.pessoa.sexo < 1 || this.pessoa.sexo == undefined ? this.serviceUtil.showMessage("Selecione --> Sexo ") :
              this.pessoa.statusPessoa < 1 || this.pessoa.statusPessoa == undefined ? this.serviceUtil.showMessage("Selecione --> Situação ") :
                this.pessoa.naturalidade == undefined ? this.serviceUtil.showMessage("Informe --> Naturalidade") :
                  this.pessoa.naturalidadeEstado == undefined ? this.serviceUtil.showMessage("Informe --> Naturalidade Estado") :
                    this.endereco.cep == undefined || this.endereco.cep == 0  ? this.serviceUtil.showMessage("Informe o --> CEP e Pressione Enter") :
                      this.endereco.estado == undefined ? this.serviceUtil.showMessage("Informe --> Estado ") :
                        this.endereco.cidade == undefined ? this.serviceUtil.showMessage("Informe --> Cidade ") :
                          this.endereco.bairro == undefined ? this.serviceUtil.showMessage("Informe --> Bairro") :
                            this.endereco.rua == undefined ? this.serviceUtil.showMessage("Informe --> Rua ") :
                              this.endereco.numero == undefined ? this.serviceUtil.showMessage("Informe --> Nº Casa ") :
                                this.dadosMembro.rol == undefined ? this.serviceUtil.showMessage("Informe --> Nº Rol ") :
                                  this.dadosMembro.congregacao == undefined ? this.serviceUtil.showMessage("Informe a --> Congregação") :
                                    this.dadosMembro.regional == undefined ? this.serviceUtil.showMessage("Informe --> Regional") :
                                      this.dadosMembro.batismoAguas == undefined ? this.serviceUtil.showMessage("Informe a data de --> Batismo nas Águas") :
                                        this.dadosMembro.batismoAguasIgreja == undefined ? this.serviceUtil.showMessage("Informe a Igreja --> Batismo nas Águas") :
                                          this.dadosMembro.batismoAguasCidade == undefined ? this.serviceUtil.showMessage("Informe a Cidade --> Onde foi batizado") :
                                            this.dadosMembro.batismoAguasEstado == undefined ? this.serviceUtil.showMessage("Informe o Estado --> Onde foi batizado") :
                                              this.dadosMembro.membroDesde == undefined ? this.serviceUtil.showMessage("Informe --> Membro Desde") :
                                                this.dadosMembro.validadeCartaoMembro == undefined ? this.serviceUtil.showMessage("Informe a data --> Validade do cartão de Membro") :
                                                  this.dadosMembro.funcao == undefined || this.dadosMembro.funcao < 1 ? this.serviceUtil.showMessage("Selecione a Função --> Função") :
                                                    this.dadosMembro.funcao > 1 && this.dadosObreiro.pastorApresentador == undefined ? this.serviceUtil.showMessage("Informe o --> Pastor Apresentador") :
                                                      this.dadosMembro.funcao > 1 && this.dadosObreiro.pastorRegional == undefined ? this.serviceUtil.showMessage("Informe o --> Pastor Regional") :
                                                        this.dadosMembro.funcao > 1 && this.historico.entradaFuncao < 1 ? this.serviceUtil.showMessage("Adicione a Entrada na Função") :
                                                          this.dadosMembro.funcao > 1 && this.historico.dataEntradaFuncao == undefined ? this.serviceUtil.showMessage("Adicione a Data de entrada na Função") :
                                                            this.cargo.cargo != undefined || this.cargo.noCargoDesde != undefined ? this.serviceUtil.showMessage("Adicione o cargo Informado ou a Data.") :
                                                              result = true

    return result;
  }



  AdicionarContato() {

    if (this.contato.ddd > 0 && this.contato.telefone > 0) {
      this.contato.id = this.contatos.length + 1
      this.contatos.push(this.contato)
      this.contato = new contatos()
      let contatosAtualizados = this.contatos.slice()
      this.contatos = contatosAtualizados;
    } else
      this.serviceUtil.showMessage("informar pelo menos o DDD e o telefone.", false)


  }

  ExcluirContato(id: any) {
    var index = this.contatos.indexOf(id);
    this.contatos.splice(index, 1)
    let contatosAtualizados = this.contatos.slice()
    this.contatos = contatosAtualizados;
  }

  ContatoSelecionado(id: any) {

  }

  AdicionarCargo() {

    if (this.cargo.cargo && this.cargo.noCargoDesde) {
      this.cargo.id = this.cargos.length + 1
      this.cargo.dataCriacao = new Date
      this.cargos.push(this.cargo);
      this.cargo = new Cargos()
      let cargosAtualizados = this.cargos.slice()
      this.cargos = cargosAtualizados;


    } else
      this.serviceUtil.showMessage("informar o cargo e a data do cargo ", false)
  }


  ExcluirCargo(id: any) {

    var index = this.cargos.indexOf(id);
    this.cargos.splice(index, 1)
    let cargosAtualizados = this.cargos.slice()
    this.cargos = cargosAtualizados;

  }

  CargoSelecionado(id: any) {
    this.cargoSelecionado = id
  }


  HistoricoSelecionado(id: any) {
    this.historicoSelecionado = id
  }

  AtualizarHistorico(id: any) {

  }

  ExcluirHistorico(id: any) {

  }

}
