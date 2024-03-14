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
import { TransplantedType } from '@angular/compiler';

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
  spinner: boolean = false


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
    try {
      this.spinner = true
      this.serverApi.read(Endpoint.Pessoa)
        .subscribe(response => {
          response = response.sort()
          this.datasource.data =
            this.filtros.inativos && this.filtros.txtBusca.length == 0
              ? response.filter(f => f.statusPessoa == 'Inativo')
              : this.filtros.inativos && this.filtros.txtBusca.length > 0
                ? response.filter(f => f.statusPessoa == 'Inativo' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()))
                : !this.filtros.inativos && this.filtros.txtBusca.length > 0
                  ? response.filter(f => f.statusPessoa != 'Inativo' && f.nome.toLowerCase().includes(this.filtros.txtBusca.toLowerCase()))
                  : response.filter(f => f.statusPessoa != 'Inativo');

          this.spinner = false;

        })
    } catch (error) {
      this.spinner = false
    }


  }

  cadastroMembro() {
    alert("Novo membro")
  }

  AtualizarMembro(id: number) {
    this.route.navigate([`/membrosupdate/${id}`]);
  }


  ImprimirFichaMembro(id: number) {

    this.spinner = true
    let confirm : boolean = false;
    this.serverApi.DownloadArquivo(id.toString(), Endpoint.RelatoriosFichaMembro)
      .subscribe(result => {
  
      this.serviceUtil.showMessage("Aguarde o Download.", false);
          this.serviceUtil.BaixarArquivo(result, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', `FichaMembro_${id.toString()}.docx`);
          this.spinner = false;
      },
      (error) => {
        this.serviceUtil.showMessage("Não foi possível baixar a ficha, verifique o cadastro", true);
      });
  }

  ExcluirMembro(id: number) {

    this.serviceUtil.PopupConfirmacao("Deseja Excluir o Membro? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent)
      .subscribe(result => {
        if (result.Status) {

          let pessoa: Pessoa = new Pessoa();
          pessoa.id = id;
          pessoa.nome = result.Motivo
          pessoa.dataCriacao = new Date
          pessoa.cpf = "0"
          pessoa.estadoCivil = 1
          pessoa.dataNascimento = new Date
          pessoa.grauInstrucao = 1
          pessoa.sexo = 1
          pessoa.statusPessoa = 5
          pessoa.fotoCadastrada = false,
            pessoa.idoso = false

          this.serverApi.create(pessoa, Endpoint.Pessoa)
            .subscribe(response => {
              this.serviceUtil.showMessage("Membro excluído com sucesso!.", false);
              this.buscarMembro()
            })
        }
      }, 
      (error) => {
        this.serviceUtil.showMessage("Problema pra excluir o cadastro!.", false);
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
      this.filtros.txtBusca = (<HTMLSelectElement>document.getElementById('txtBusca')).value;
      this.buscarMembro()
    }
  }

  CartaRecomendacao(id: number) {
    alert(id)
  }

  CartaMudanca(id: number) {
    alert(id)
  }

}
