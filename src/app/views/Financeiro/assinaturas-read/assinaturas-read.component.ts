import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewFinanceiro } from '../model/viewFinanceiro';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assinaturas-read',
  templateUrl: './assinaturas-read.component.html',
  styleUrls: ['./assinaturas-read.component.css']
})
export class AssinaturasReadComponent implements OnInit {

  idLinhaSelecionada = 0;
  igrejaSelecionada = 0;
  Colunas = ['id', 'idAssinatura', 'numeroCobranca', 'linkBoleto', 'dataVencimento', 'tolerancia', 'statusPagamento', 'action']
  tipoUsuario = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<any>();
  ngOnInit(): void {

  }

  statusPagamento = false;


  Filtros(event: any) {

  }

  LinhaSelecionada(id: any): void{

  }

}
