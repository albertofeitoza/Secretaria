import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { ViewFilhos } from 'src/app/views/filhos-membros/model/viewFilhos';

@Component({
  selector: 'app-filhos',
  templateUrl: './filhos.component.html',
  styleUrls: ['./filhos.component.css']
})

export class FilhosComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  filhos = new MatTableDataSource<ViewFilhos>([]);
  idResponsavel = 0;

  contatoSelecionado: 0;
  simNao: any[]
  pai: Pessoa[] = new Array();
  mae: Pessoa[] = new Array();

  Colunas = ['id', 'nome', 'dataNascimento', 'membro'];

  constructor(
    private serviceUtil: UtilServiceService,
    private serviceApi: AllservicesService<any>,
    private matdialogRef: MatDialogRef<FilhosComponent>,
    private auth: AutenticacaoService
  ) {

  }

  ngOnInit(): void {
    this.CarregarCombos()
    this.BuscarDados();
  }
  private BuscarDados() {
    this.serviceApi.read(Endpoint.Filhos + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((response: ViewFilhos[]) => {
        this.filhos.data = response.filter(x => x.idPai === Number(this.matdialogRef.id) || x.idMae === Number(this.matdialogRef.id));
      })
  }

  private CarregarCombos() {
    this.simNao = this.serviceUtil.SimNao()
    this.BuscarPessoa()
  }

  private BuscarPessoa() {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe(x => {
        this.pai = x;
        this.mae = x;
      });
  }

  FilhoSelecionado(id: number) {

  }

}
