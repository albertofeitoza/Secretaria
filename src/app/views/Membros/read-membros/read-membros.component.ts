import { Component, ViewChild, OnInit, Injectable } from '@angular/core';
import { Pessoa, UniaoCadastro, ViewPessoa } from 'src/app/models/pessoa';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { Filtros } from 'src/app/models/Filtros';
import { ActivatedRoute, Router } from '@angular/router';
import { CartarecomendacaoComponent } from '../cartarecomendacao/cartarecomendacao.component';
import { Cartas } from 'src/app/models/Cartas';
import { FilhosComponent } from '../Modal/filhos/filhos.component';
import { ControlePresencaComponent } from '../Modal/controle-presenca/controle-presenca.component';
import { UnirCadastroComponent } from '../Modal/unir-cadastro/unir-cadastro.component';
import jsPDF from 'jspdf';
import { TipoRelatorio } from 'src/app/enum/TipoRelatorio';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { map } from 'rxjs';
import { TodasAsIgrejas } from 'src/app/models/Igreja';


@Injectable()

@Component({
  selector: 'app-read-membros',
  templateUrl: './read-membros.component.html',
  styleUrls: ['./read-membros.component.css'],
})
export class ReadMembrosComponent implements OnInit {

  estadoForm: boolean = true
  pessoaSelecionada: number = 0
  corLinhaGrid: number = 0
  filtros: Filtros = new Filtros()
  spinner: boolean = false
  Colunas = ['id', 'rol', 'foto', 'nome', 'dataNascimento', 'funcao', 'statusPessoa', 'action']
  igrejaSelecionada = 0;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<Pessoa>();

  listaIgrejas: TodasAsIgrejas[] = new Array();

  constructor(
    private serverApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AutenticacaoService

  ) {

  }
  ngOnInit() {

    if (this.activatedRoute.snapshot.params['nome'] != null)
      this.filtros.txtBusca = this.activatedRoute.snapshot.params['nome'];

    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;

    this.buscarMembro()
    this.CarregaCombo();


  }

  private CarregaCombo(): void {
    this.serverApi.read(Endpoint.Igreja + `/igrejasFilhas/${this.igrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.igrejaSelecionada === 0 ? this.auth.dadosUsuario.IgrejaLogada : this.igrejaSelecionada}`)
      .subscribe((result: TodasAsIgrejas[]) => {
        this.listaIgrejas = result;
      })
  }

  public AlterarBuscaIgreja(): void {

    this.auth.dadosUsuario.IgrejaSelecionada = this.igrejaSelecionada;
    this.buscarMembro();
    this.CarregaCombo();

  }


  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }


  AbaCadastroMembro(id: any) {
    alert("aba" + id)
  }

  buscarMembro() {
    try {
      this.spinner = true

      const idIgrejas = new Array();


      this.serverApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.igrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.igrejaSelecionada === 0 ? this.auth.dadosUsuario.IgrejaLogada : this.igrejaSelecionada}`)
        .subscribe((response) => {
          response = response.sort()

          this.datasource.data =

            this.filtros.inativos && this.filtros.txtBusca.length == 0
              ? response.filter(f => f.statusPessoa == 'Inativo')

              : this.filtros.inativos && this.filtros.txtBusca.length > 0
                ? response.filter(f => f.statusPessoa == 'Inativo' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()) || f.statusPessoa == 'Inativo' && f.rol.toString().includes(this.filtros.txtBusca))

                : this.filtros.precadastro && this.filtros.txtBusca.length == 0
                  ? response.filter(f => f.statusPessoa == 'PreCadastro')

                  : this.filtros.precadastro && this.filtros.txtBusca.length > 0
                    ? response.filter(f => f.statusPessoa == 'PreCadastro' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()) || f.statusPessoa == 'PreCadastro' && f.rol.toString().toLowerCase().includes(this.filtros.txtBusca))

                    : this.filtros.obreiros && this.filtros.txtBusca.length == 0
                      ? response.filter(f => f.funcao != "Membro" && f.statusPessoa != "Inativo" && f.statusPessoa != "PreCadastro")

                      : this.filtros.obreiros && this.filtros.txtBusca.length > 0
                        ? response.filter(f => f.funcao != "Membro" && f.statusPessoa != "Inativo" && f.statusPessoa != "PreCadastro" && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()) || f.funcao != "Membro" && f.statusPessoa != "Inativo" && f.statusPessoa != "PreCadastro" && f.rol.toString().toLowerCase().includes(this.filtros.txtBusca))

                        : !this.filtros.inativos && !this.filtros.obreiros && !this.filtros.precadastro && this.filtros.txtBusca.length == 0
                          ? response.filter(f => f.statusPessoa != 'Inativo' && f.statusPessoa != 'PreCadastro')
                          : response.filter(f => f.statusPessoa != 'Inativo' && f.statusPessoa != 'PreCadastro' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()) || f.statusPessoa != 'Inativo' && f.statusPessoa != 'PreCadastro' && f.rol.toString().toLowerCase().includes(this.filtros.txtBusca.toLowerCase()));

          this.spinner = false;
        })


    } catch (error) {
      this.spinner = false
    }


  }

  private Precadastro(filtro: string = "") {
    this.serverApi.read(`${Endpoint.Pessoa}/preCadastro?igreja=${this.igrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.igrejaSelecionada === 0 ? this.auth.dadosUsuario.IgrejaLogada : this.igrejaSelecionada}`)
      .subscribe(() => { });
  }


  cadastroMembro() {
    alert("Novo membro")
  }

  AtualizarMembro(id: number) {
    this.route.navigate([`/membrosupdate/${id}`]);
  }


  ImprimirFichaMembro(id: number) {

    this.spinner = true
    this.serverApi.DownloadArquivo(id.toString(), Endpoint.RelatoriosFichaMembro)
      .subscribe(result => {

        this.serviceUtil.showMessage("Aguarde a impressão.", false);

        this.serviceUtil.BaixarArquivo(result, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', `FichaMembro${id.toString()}.docx`);
        this.spinner = false;
      },
        (error) => {
          this.serviceUtil.showMessage("Não foi possível baixar a ficha, verifique o cadastro", true);
        });
  }

  ExcluirMembro(id: number) {

    this.serverApi.readById(id.toString(), Endpoint.Pessoa)
      .subscribe(res => {
        if (res.data.igreja.pastores[0].pessoaId === id) {
          this.serviceUtil.showMessage("O pastor da Igreja não pode ser excluido, emita a carta de mudança!.", false);
          return
        } else {
          this.serviceUtil.PopupConfirmacao("Deseja Excluir o Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
            .subscribe(result => {
              if (result.Status) {

                let pessoa: Pessoa = new Pessoa();
                pessoa.id = id;
                pessoa.nome = result.Motivo
                pessoa.dataCriacao = new Date
                pessoa.cpf = "0"
                pessoa.estadoCivil = 1
                pessoa.dataNascimento = new Date
                pessoa.grauInstrucao = 1
                pessoa.sexo = 1
                pessoa.statusPessoa = 5
                pessoa.fotoCadastrada = false,
                  pessoa.idoso = false

                this.serverApi.create(pessoa, Endpoint.Pessoa)
                  .subscribe(response => {
                    this.serviceUtil.showMessage("Membro excluído com sucesso!.", false);
                    this.buscarMembro()
                  })
              }
            },
              (error) => {
                this.serviceUtil.showMessage("Problema pra excluir o cadastro!.", false);
              });
        }

      })


  }

  public HistoricoMembro(id: number): void {
    this.filtros.pessoaId = id;
    this.filtros.igrejaId = this.igrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.igrejaSelecionada === 0 ? this.auth.dadosUsuario.IgrejaLogada : this.igrejaSelecionada;

    this.serverApi.readById(TipoRelatorio.dadosPessoa.toString(), Endpoint.Relatorios, JSON.stringify(this.filtros))
      .subscribe(() => {
        this.serverApi.DownloadArquivo(TipoRelatorio.dadosPessoa.toString(), Endpoint.DownloadArquivo, '', JSON.stringify(this.filtros))
          .subscribe(result => {
            this.serviceUtil.Imprimir(result, 'application/pdf');
          }, err => {
            this.serviceUtil.showMessage("Erro ao realizar a baixa do histórico da pessoa.")
          }
          );
      }, (erro) => {
        this.serviceUtil.showMessage("Erro ao gerar o histórico da pessoa.")
      });
  }

  PessoaSelecionada(id: number) {
    this.pessoaSelecionada = id
  }

  mudarPagina(event: any) {
    alert("mudei")
  }


  //contatos
  selecionarContato(ecent: any) {

  }

  cadContato() {

  }

  Filtros(keyEvent: any) {

    if (keyEvent.which === 13 || keyEvent.which === 1 || keyEvent.type == 'change') {
      this.filtros.txtBusca = (<HTMLSelectElement>document.getElementById('txtBusca')).value;

      if (this.filtros.periodoSelecionado == 1) {
        this.filtros.precadastro = false
        this.filtros.obreiros = false
      } else if (this.filtros.periodoSelecionado == 2) {
        this.filtros.inativos = false
        this.filtros.obreiros = false
        this.Precadastro();

      } else if (this.filtros.periodoSelecionado == 3) {
        this.filtros.inativos = false
        this.filtros.precadastro = false
      } else {
        this.filtros.inativos = false
        this.filtros.precadastro = false
        this.filtros.obreiros = false
      }
      this.buscarMembro()
    }
  }

  Cartas(id: number) {

    this.serviceUtil.PopupConfirmacao("Informar os dados", TipoPopup.ComponenteInstancia, CartarecomendacaoComponent, id)
      .subscribe(x => {

        if (x.Status) {
          let dados: Cartas = new Cartas();
          dados = x.data;
          
          this.spinner = true;
          this.serverApi.DownloadCartas(dados, Endpoint.RelatoriosCartas)
            .subscribe(result => {
              this.serviceUtil.showMessage("Aguarde a Impressão.", false);

              this.serviceUtil.BaixarArquivo(result, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', `Carta_${id.toString()}.docx`);
              this.spinner = false;
            },
              (error) => {
                this.serviceUtil.showMessage("Não foi possível realizar a impressão , verifique o cadastro", true);
              });
        }
        else {
          this.serviceUtil.showMessage("Informações ignoradas", false)
        }
      })
  }

  Filhos(id: number) {
    this.serviceUtil.PopupConfirmacao('', TipoPopup.ComponenteInstancia, FilhosComponent, id, '70%', '80%');
  }

  public JustificarPresenca(id: number): void {
    this.serviceUtil.PopupConfirmacao('', TipoPopup.ComponenteInstancia, ControlePresencaComponent, id, '70%', '35%');
  }

  public UnificarCadastro(id: number): void {
    this.serviceUtil.PopupConfirmacao('', TipoPopup.ComponenteInstancia, UnirCadastroComponent, id, '75%', '95%')
      .subscribe(result => {
        if (result) {

          let dados: UniaoCadastro = new UniaoCadastro()
          dados.idPessoa = id;
          dados.idRascunho = result?.id;
          dados.motivo = result?.motivo

          if (id === dados.idRascunho) {
            this.serviceUtil.showMessage("Escolha uma pessoa diferente para união dos dados!")
          } else {
            this.serverApi.create(dados, `${Endpoint.Pessoa}/uniaoCadastro`)
              .subscribe(() => {
                this.serviceUtil.showMessage("Cadastros unificados, não é possível desfazer essa operação!")
              })
          }
        }
      });
  }



}
