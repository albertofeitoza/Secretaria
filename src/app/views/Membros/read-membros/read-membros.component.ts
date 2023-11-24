import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Pessoa } from 'src/app/models/pessoa';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, matSortAnimations } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';


@Component({
  selector: 'app-read-membros',
  templateUrl: './read-membros.component.html',
  styleUrls: ['./read-membros.component.css'],
})
export class ReadMembrosComponent implements OnInit {

  estadoForm: boolean = true
  pessoa: Pessoa[] = new Array()
  pessoaSelecionada: number = 0
  corLinhaGrid: number = 0
 
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  Colunas = ['id', 'rol', 'foto', 'nome', 'dataNascimento', 'funcao', 'statusPessoa', 'action']
  dataSource: MatTableDataSource<Pessoa>;

 
  constructor(private serviceMembro : AllservicesService<Pessoa>) {
   
    
  }
  ngOnInit() {
    this.buscarMembro(null)
  }


  AbaCadastroMembro(id: any) {
    alert("aba" + id)
  }

  buscarMembro(event: any) {
    this.serviceMembro.read(Endpoint.Pessoa, "")
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

  ExcluirAgenda(id: number) {
    alert(id)
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
