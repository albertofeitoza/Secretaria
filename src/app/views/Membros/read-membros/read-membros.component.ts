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

@Injectable()

@Component({
  selector: 'app-read-membros',
  templateUrl: './read-membros.component.html',
  styleUrls: ['./read-membros.component.css'],
})
export class ReadMembrosComponent implements OnInit {
  
  estadoForm: boolean = true
  pessoa: ViewPessoa[] = new Array()
  pessoaSelecionada: number = 0
  corLinhaGrid: number = 0
 
 

  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  Colunas = ['id', 'rol', 'foto', 'nome', 'dataNascimento', 'funcao', 'statusPessoa', 'action']
  dataSource: MatTableDataSource<Pessoa>
 
  constructor(
    private serverApi : AllservicesService<any>,
    private serviceUtil : UtilServiceService
    ) {
    
  }
  ngOnInit() {
    this.buscarMembro(null)
  }


  AbaCadastroMembro(id: any) {
    alert("aba" + id)
  }

  buscarMembro(event: any) {
    this.serverApi.read(Endpoint.Pessoa, "")
      .subscribe(x => {
       this.pessoa = x
      })
  }

  cadastroMembro() {
    alert("Novo membro")
  }

  AtualizarMembro(id: number) {
    alert(id)
  }

  ExcluirMembro(id: number) {
    
   this.serviceUtil.PopupConfirmacao("Deseja Excluir o Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
   .subscribe(result => {
       
    alert(result)
       
    });
   


  }

  PessoaSelecionada(id: number) {
    this.pessoaSelecionada = id
  }

  //contatos
  selecionarContato(ecent: any) {

  }

  cadContato() {

  }


}
