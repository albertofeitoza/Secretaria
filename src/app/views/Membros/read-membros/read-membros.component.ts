import { Component, AfterViewInit, ViewChild, OnInit, Injectable } from '@angular/core';
import { Pessoa, ViewPessoa } from 'src/app/models/pessoa';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { MatSort, matSortAnimations } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Observable, Subject, map } from 'rxjs';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { Filtros } from 'src/app/models/Filtros';
import { Router } from '@angular/router';

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


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  Colunas = ['id', 'rol', 'foto', 'nome', 'dataNascimento', 'funcao', 'statusPessoa', 'action']
  datasource = new MatTableDataSource<Pessoa>();

  constructor(
    private serverApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private route: Router
  ) {

  }
  ngOnInit() {
    this.buscarMembro()
  }


  ngAfterViewInit() {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
  }


  AbaCadastroMembro(id: any) {
    alert("aba" + id)
  }

  buscarMembro() {
    this.serverApi.read(Endpoint.Pessoa)
      .subscribe(response => {
        response = response.sort()
        this.datasource.data =
          this.filtros.Inativos && this.filtros.TxtBusca.length == 0
            ? response.filter(f => f.statusPessoa == 'Inativo')
            : this.filtros.Inativos && this.filtros.TxtBusca.length > 0
              ? response.filter(f => f.statusPessoa == 'Inativo' && f.nome.toLowerCase().includes(this.filtros.TxtBusca.toLowerCase()))
              : !this.filtros.Inativos && this.filtros.TxtBusca.length > 0
                ? response.filter(f => f.statusPessoa != 'Inativo' && f.nome.toLowerCase().includes(this.filtros.TxtBusca.toLowerCase()))
                : response.filter(f => f.statusPessoa != 'Inativo');
      })
  }

  cadastroMembro() {
    alert("Novo membro")
  }

  AtualizarMembro(id: number) {
    this.route.navigate([`/membrosupdate/${id}`]);
  }

  ExcluirMembro(id: number) {

    this.serviceUtil.PopupConfirmacao("Deseja Excluir o Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result?.Status) {
          this.serverApi.delete(id, Endpoint.Pessoa, result?.Motivo,)
            .subscribe(() => {
              this.serviceUtil.showMessage("Membro excluído com sucesso!", false);
              this.buscarMembro()
            })
        }
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

    if (keyEvent.which === 13 || keyEvent.which == 1 || keyEvent.type == 'change') {
      this.filtros.TxtBusca = (<HTMLSelectElement>document.getElementById('txtBusca')).value;
      this.buscarMembro()
    }
  }

}
