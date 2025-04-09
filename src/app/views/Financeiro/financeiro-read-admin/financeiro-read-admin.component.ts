import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewFinanceiro } from '../model/viewFinanceiro';
import { MatPaginator } from '@angular/material/paginator';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { MatDialogRef } from '@angular/material/dialog';
import { FinanceiroDto } from '../model/financeiroDto';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { FinanceiroCadastroBoletoComponent } from '../modal/financeiro-cadastro-boleto/financeiro-cadastro-boleto.component';

@Injectable()

@Component({
  selector: 'app-financeiro-read-admin',
  templateUrl: './financeiro-read-admin.component.html',
  styleUrls: ['./financeiro-read-admin.component.css']
})
export class FinanceiroReadAdminComponent implements OnInit {
  idLinhaSelecionada = 0;
  igrejaSelecionada = 0;
  Colunas = ['id', 'assinaturaId', 'numeroCobranca', 'linkBoleto', 'dataVencimento', 'statusPagamento', 'action']
  tipoUsuario = false;
  assinatura: any

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<ViewFinanceiro>();


  constructor(
    private dialogRef: MatDialogRef<FinanceiroReadAdminComponent>,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private auth: AutenticacaoService,

  ) { }


  ngOnInit(): void {

    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? true : false;
    this.assinatura = this.dialogRef._containerInstance._config.data.dadosTela
    this.BuscarFaturas();
  }

  private BuscarFaturas() {
    this.serviceApi.read(Endpoint.Financeiro + `/estabelecimento/${this.igrejaSelecionada}`)
      .subscribe((result: ViewFinanceiro[]) => {
        this.datasource.data = result.filter(x => x.assinaturaId == this.assinatura.id || x.idAssinatura == this.assinatura.idAssinatura);
      })
  }

  public Filtros(event: any): void {

  }

  public LinhaSelecionada(id: number): void {

  }

  public AtualizarFatura(row: any): void {

  }

  public CadastroBoleto(): void {
    this.serviceUtil.Popup("", TipoPopup.cadastro, FinanceiroCadastroBoletoComponent, 0, 'auto', 'auto', false, false, this.assinatura)
      .subscribe(() => {
        this.BuscarFaturas();
      });
  }

  public EditarBoleto(row: any): void {
    this.serviceUtil.Popup("", TipoPopup.edicaoDados, FinanceiroCadastroBoletoComponent, 0, 'auto', 'auto', false, false, row)
      .subscribe(() => {
        this.BuscarFaturas();
      });
  }

}
