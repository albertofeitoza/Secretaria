import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { Filtros } from 'src/app/models/Filtros';
import { Pessoa } from 'src/app/models/pessoa';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-unir-cadastro',
  templateUrl: './unir-cadastro.component.html',
  styleUrls: ['./unir-cadastro.component.css']
})
export class UnirCadastroComponent implements OnInit {

  @Input() uniaoCadastro = false;
  filtros: Filtros = new Filtros()
  spinner: boolean = false
  Colunas = ['id', 'nome', 'dataNascimento', 'statusPessoa', 'action']

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<Pessoa>();


  constructor(
    private matdialogRef: MatDialogRef<UnirCadastroComponent>,
    private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>

  ) {

  }

  ngOnInit(): void {
    this.buscarMembro()
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
  }

  Filtros(keyEvent: any) {
    this.filtros.txtBusca = "";
    if (keyEvent.which === 13 || keyEvent.which === 1) {
      this.filtros.txtBusca = (<HTMLSelectElement>document.getElementById('txtBuscaRascunho')).value;

      this.buscarMembro()
    }
  }

  buscarMembro() {
    try {
      this.spinner = true

      this.serverApi.read(Endpoint.Pessoa)
        .subscribe(response => {
          response = response.sort()
          this.datasource.data =

            this.filtros.txtBusca.length > 0
              ? response.filter(f => f.statusPessoa != 'Inativo' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase())) 
              : response.filter(f => f.statusPessoa != 'Inativo');

              this.spinner = false;

        })
    } catch (error) {
      this.spinner = false
    }
  }

  public SelecionarMembro(id: number): void {
    this.serviceUtil.PopupConfirmacao("Deseja Realmente unir esse cadastro ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result.Status) {

          const response = {
            id: id,
            motivo: result.Motivo
          }
          
          
          this.matdialogRef.close(response);
        }
      })
  }
}
