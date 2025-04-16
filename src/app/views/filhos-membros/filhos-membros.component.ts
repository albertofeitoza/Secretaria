import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { ModalSelecionaLiderComponent } from './modal/modal-seleciona-lider/modal-seleciona-lider.component';
import { ViewFilhos } from './model/viewFilhos';
import { FilhosAdicionarComponent } from './modal/filhos-adicionar/filhos-adicionar.component';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';

@Component({
  selector: 'app-filhos-membros',
  templateUrl: './filhos-membros.component.html',
  styleUrls: ['./filhos-membros.component.css']
})
export class FilhosMembrosComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  filhos = new MatTableDataSource<ViewFilhos>();
  igrejaSelecionada = 0;
  tipoUsuario = 0;
  filho: ViewFilhos = new ViewFilhos();
  contatoSelecionado: 0;
  simNao: any[];
  filhoMembro: number = 0;
  ListaPai: any[] = new Array();
  ListaMae: any[] = new Array();
  tipoFilhos: any[] = new Array()
  pessoas: Pessoa[] = new Array()
  txtBusca: string = "";
  Colunas = ['id', 'nome', 'dataNascimento', 'membro', 'nomePai', 'nomeMae', 'tipoFilho', 'action'];

  constructor(

    private servico: UtilServiceService,
    private serviceApi: AllservicesService<any>,
    private router: Router,
    private auth: AutenticacaoService

  ) {

  }

  ngOnInit(): void {
    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
    this.BuscarFilhos()
  }

  ngAfterViewInit() {
    this.filhos.paginator = this.paginator
    this.filhos.sort = this.sort;
  }

  private BuscarFilhos(): void {
    this.serviceApi.read(Endpoint.Filhos + `/estabelecimento/${this.igrejaSelecionada}`)
      .subscribe((response: ViewFilhos[]) => {

        response =
          this.tipoUsuario === 5 ? response.filter(x => x.tipoFilho == 0) :
            this.tipoUsuario === 6 ? response.filter(x => x.tipoFilho == 1) : response;

        this.filhos.data =
          this.txtBusca.length > 0 ?
            response.filter(f => f.nome.toLowerCase().includes(this.txtBusca.toLowerCase()))
            : response

        this.filhos.paginator = this.paginator
        this.filhos.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = "Itens por página";
        this.txtBusca = '';
      })
  }

  public Adicionar(): void {

    const request = {
      idIgreja: this.igrejaSelecionada,
      idCrianca: 0
    };

    this.servico.Popup("", 0, FilhosAdicionarComponent, 0, 'auto', 'auto', true, false, request)
      .subscribe(result => {

        this.BuscarFilhos();

      });

  }

  Editar(id: string) {

    const request = {
      idIgreja: this.igrejaSelecionada,
      idCrianca: id
    };

    this.servico.Popup("", 0, FilhosAdicionarComponent, 0, 'auto', 'auto', true, false, request)
      .subscribe(result => {

        this.BuscarFilhos();

      });
  }

  Excluir(id: number) {

    this.servico.Popup("Deseja Realmente excluir esse cadastro ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, null, false)
      .subscribe(result => {
        if (result.Status) {
          this.serviceApi.create(id, Endpoint.Filhos + '/excluir')
            .subscribe(() => {
              this.servico.showMessage('Cadastro excluído com sucesso!', false)
              this.BuscarFilhos();
            });
        }
      });
  }

  FilhoSelecionado(id: number) {

  }

  public Filtros(keyEvent: any): void {
    if (keyEvent.which === 13 || keyEvent.which === 1) {
      this.txtBusca = (<HTMLSelectElement>document.getElementById('txtBusca')).value;

      this.BuscarFilhos();
    }
  }

  public EmissaoCertificado(row: ViewFilhos): void {

    this.servico.Popup("", 0, ModalSelecionaLiderComponent, 0, 'auto', 'auto', true, false, row)
      .subscribe(result => {

        if (result.status) {
          const url = `/Certificados?IdPessoa=${0}&IdCrianca=${row.id}&TipoRelatorio=${21}&NomePai=${result.NomePai}&NomeMae=${result.NomeMae}&LiderDepartamento=${result.NomeLider}`

          this.serviceApi.DownloadArquivo('', Endpoint.Relatorios + `${url}`,)
            .subscribe((result: Blob) => {

              this.servico.showMessage("Aguarde a impressão.", false);
              this.servico.BaixarArquivo(result, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', `CertificadoCrianca${row.id.toString()}.docx`);
            },
              (error) => {
                this.servico.showMessage("Não foi possível baixar o certificado, verifique o cadastro", true);
              });
        } else
          this.servico.showMessage("impressão ignorada.", true);


      })

  }
}
