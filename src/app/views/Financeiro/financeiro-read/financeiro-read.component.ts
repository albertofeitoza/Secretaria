import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ViewFinanceiro } from '../model/viewFinanceiro';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()

@Component({
  selector: 'app-financeiro-read',
  templateUrl: './financeiro-read.component.html',
  styleUrls: ['./financeiro-read.component.css']
})
export class FinanceiroReadComponent implements OnInit {

  idLinhaSelecionada = 0;
  igrejaSelecionada = 0;
  Colunas = ['id', 'assinaturaId', 'numeroCobranca', 'linkBoleto', 'dataVencimento', 'statusPagamento']
  tipoUsuario = false;
  assinatura: any

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<ViewFinanceiro>();


  constructor(
    private serviceApi: AllservicesService<any>,
    private auth: AutenticacaoService,

  ) { }


  ngOnInit(): void {
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? true : false;
    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada
    this.BuscarFaturas();
  }

  private BuscarFaturas() {
    this.serviceApi.read(Endpoint.Financeiro + `/estabelecimento/${this.igrejaSelecionada}`)
      .subscribe((result: ViewFinanceiro[]) => {
        this.datasource.data = result;
      })
  }

  public Filtros(event: any): void {

  }

  public LinhaSelecionada(id: number): void {

  }

  public AtualizarFatura(row: any): void {

  }

}
