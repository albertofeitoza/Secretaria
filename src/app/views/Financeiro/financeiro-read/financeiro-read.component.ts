import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewFinanceiro } from '../model/viewFinanceiro';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-financeiro-read',
  templateUrl: './financeiro-read.component.html',
  styleUrls: ['./financeiro-read.component.css']
})
export class FinanceiroReadComponent implements OnInit {

  idLinhaSelecionada = 0;
  igrejaSelecionada = 0;
  Colunas = ['id', 'idAssinatura', 'numeroCobranca', 'linkBoleto', 'dataVencimento', 'tolerancia', 'statusPagamento', 'action']
  tipoUsuario = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<ViewFinanceiro>();


  constructor(
    private serviceApi: AllservicesService<any>,
    private auth: AutenticacaoService
  ) { }


  ngOnInit(): void {
    
    this.igrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? true : false;
    this.BuscarFaturas();
  }

  private BuscarFaturas() {
     this.serviceApi.read(Endpoint.Financeiro + `/estabelecimento/${this.igrejaSelecionada === this.auth.dadosUsuario.IgrejaLogada || this.igrejaSelecionada === 0 ? this.auth.dadosUsuario.IgrejaLogada : this.igrejaSelecionada}`)
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
