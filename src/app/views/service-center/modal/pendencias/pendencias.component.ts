import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceCenter } from 'src/app/models/ServiceCenter';


@Component({
  selector: 'app-pendencias',
  templateUrl: './pendencias.component.html',
  styleUrls: ['./pendencias.component.css']
})
export class PendenciasComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<any>();
  Colunas = ['id', 'nomeMembro', 'departamento', 'nomePendencia'];
  titulo = ''

  constructor(
    public dialogRef: MatDialogRef<PendenciasComponent>
  ) { }

  ngOnInit(): void {
    this.CarregarTela()
  }


  ngAfterViewInit() {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }

  private CarregarTela(): void {
    
    //this.datasource.data = this.dialogRef._containerInstance._config.data.mensagem.dadosTela;

    //let dados: ServiceCenter[] = this.dialogRef._containerInstance._config.data.dadosTela;
    this.titulo = this.dialogRef._containerInstance._config.data.mensagem;
    this.datasource.data = this.dialogRef._containerInstance._config.data.dadosTela;
    this.datasource.sort = this.sort;
  }
}




