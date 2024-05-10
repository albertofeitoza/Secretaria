import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pessoa, ViewFilhos } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

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

  filho: ViewFilhos = new ViewFilhos();
  contatoSelecionado: 0;
  simNao: any[]
  pai: Pessoa[] = new Array();
  mae: Pessoa[] = new Array();

  Colunas = ['id', 'nome', 'dataNascimento', 'membro', 'idpai', 'idmae', 'action'];

  constructor(
    
    private serviceUtil: UtilServiceService,
    private serviceApi: AllservicesService<any>

  ) {

  }

  ngOnInit(): void {

    this.BuscarFilhos(this.idResponsavel);

    this.CarregarCombos()
    this.BuscarDados();

  }
  private BuscarDados() {
    this.serviceApi.read(Endpoint.Filhos)
      .subscribe((response: ViewFilhos[]) => {
       

        let filhos = new Array();
        response.forEach(element => {

          let filho: ViewFilhos = new ViewFilhos();

          filho.id = element.id;
          filho.nome = element.nome;
          filho.dataNascimento = element.dataNascimento;
          filho.membro = element.membro ? 'Sim' : 'Não';
          filho.idPai = element.idPai
          filho.idMae = element.idMae
          filhos.push(filho);
        });
        this.filhos.data = filhos;
      })
  }

  private CarregarCombos() {
    this.simNao = this.serviceUtil.SimNao()
    this.BuscarPessoa()
  }

  private BuscarPessoa() {
    this.serviceApi.read(Endpoint.Pessoa)
      .subscribe(x => {
        this.pai = x;
        this.mae = x;
      });
  }

  Adicionar() {
    
    // this.filho.data.responsaveis.push
    
    this.serviceApi.create(this.filho, Endpoint.Filhos)
      .subscribe(() => {
        this.serviceUtil.showMessage('Cadastrado com sucesso')
      })
  }


  Editar(id: number) {



  }

  Excluir(id: number) {

  }

  FilhoSelecionado(id: number) {

  }

  private BuscarFilhos(id: number) {


  }
}
