import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pessoasporfuncao',
  templateUrl: './pessoasporfuncao.component.html',
  styleUrls: ['./pessoasporfuncao.component.css']
})
export class PessoasporfuncaoComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<any>();
  Colunas = ['nome', 'funcao', 'statusPessoa']
  titulo = ''



  constructor(
    public dialogRef: MatDialogRef<PessoasporfuncaoComponent>
  ) { }

  ngOnInit(): void {
    this.CarregarTela();
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }

  private CarregarTela(): void {
    this.titulo = this.dialogRef._containerInstance._config.data.mensagem;
    this.datasource.data = this.dialogRef._containerInstance._config.data.dadosTela;
    this.datasource.sort = this.sort;
  }

}
