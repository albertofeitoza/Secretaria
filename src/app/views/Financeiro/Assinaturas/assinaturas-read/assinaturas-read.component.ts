import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewFinanceiro } from '../../model/viewFinanceiro';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssinaturas } from '../model/viewAssinaturas';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { AssinaturaAdicionarComponent } from '../modal/assinatura-adicionar/assinatura-adicionar.component';
import { FinanceiroReadComponent } from '../../financeiro-read/financeiro-read.component';
import { FinanceiroReadAdminComponent } from '../../financeiro-read-admin/financeiro-read-admin.component';

@Component({
  selector: 'app-assinaturas-read',
  templateUrl: './assinaturas-read.component.html',
  styleUrls: ['./assinaturas-read.component.css']
})
export class AssinaturasReadComponent implements OnInit {


  idLinhaSelecionada = 0;
  igrejaSelecionada = 0;
  Colunas = ['id', 'idAssinatura', 'igreja', 'diaVencimento', 'tolerancia', 'nome', 'cpf', 'telefone', 'email', 'action']
  tipoUsuario = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<ViewAssinaturas>();

  constructor(
    private serviceApi: AllservicesService<any>,
    private auth: AutenticacaoService,
    private serviceUtil: UtilServiceService
  ) {

  }
  ngOnInit(): void {
    this.BuscarAssinaturas();
  }

  private BuscarAssinaturas(): void {
    this.serviceApi.read(Endpoint.Assinaturas + `/estabelecimento/0`)
      .subscribe((result: ViewAssinaturas[]) => {
        this.datasource.data = result;
      })

    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }

  statusPagamento = false;


  Filtros(event: any) {

  }

  LinhaSelecionada(id: any): void {

  }

  public EditarAssinatura(id: number): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, AssinaturaAdicionarComponent, 0, 'auto', 'auto', false, false, id)
    .subscribe(() => {
      this.BuscarAssinaturas();
    });
  }

  public AdicionarAssinatura(): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, AssinaturaAdicionarComponent, 0, 'auto', 'auto', false, false, null)
      .subscribe(() => {
        this.BuscarAssinaturas();
      });
  }

  public Faturas(row: any): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, FinanceiroReadAdminComponent, 0, '65%', '55%', false, false, row)
    .subscribe(() => {
      this.BuscarAssinaturas();
    });
  }

}
