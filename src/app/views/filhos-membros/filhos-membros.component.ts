import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pessoa, ViewFilhos } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-filhos-membros',
  templateUrl: './filhos-membros.component.html',
  styleUrls: ['./filhos-membros.component.css']
})
export class FilhosMembrosComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  filhos = new MatTableDataSource<ViewFilhos>();

  filho: ViewFilhos = new ViewFilhos();
  contatoSelecionado: 0;
  simNao: any[];
  filhoMembro: number = 0;
  ListaPai: any[] = new Array();
  ListaMae: any[] = new Array();
  pessoas: Pessoa[] = new Array()
  txtBusca: string = "";
  Colunas = ['id', 'nome', 'dataNascimento', 'membro', 'idPai', 'idMae', 'action'];

  constructor(

    private serviceUtil: UtilServiceService,
    private serviceApi: AllservicesService<any>,
    private router: Router,
    private auth : AutenticacaoService

  ) {

  }

  ngOnInit(): void {
    this.CarregarCombos()
  }

  ngAfterViewInit() {
    this.filhos.paginator = this.paginator
    this.filhos.sort = this.sort;
  }

  private BuscarDados(): void {
    this.serviceApi.read(Endpoint.Filhos + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}` )
      .subscribe((response: ViewFilhos[]) => {

        const Response = this.txtBusca.length > 0 
        ? response.filter(f => f.nome.toLowerCase().includes(this.txtBusca.toLowerCase())) : response

        let filhos = new Array();
        Response.forEach(element => {

          let filho: ViewFilhos = new ViewFilhos();

          filho.id = element.id
          filho.nome = element.nome;
          filho.dataNascimento = element.dataNascimento;
          filho.membro = element.membro ? 'Sim' : 'Não';
          filho.idPai = this.pessoas?.filter(x => x.id === Number(element.idPai))?.map(x => x.nome)?.toString() ?? " ";
          filho.idMae =  this.pessoas?.filter(x => x.id === Number(element.idMae))?.map(x => x.nome)?.toString()?? " " ;
          filhos.push(filho);
        });
        this.filhos.data = filhos;
        this.filhos.sort = this.sort
      })
  }

  private async CarregarCombos() {
    this.simNao = this.serviceUtil.SimNao()
    this.CarregarComboPaiMae()
  }

  private CarregarComboPaiMae() {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: Pessoa[]) => {

        this.pessoas = result;

        result.forEach(res => {

          const extracao = {
            id: res.id,
            nome: res.nome
          }
          if (res.sexo === 1)
            this.ListaPai.push(extracao);

          if (res.sexo === 2)
            this.ListaMae.push(extracao);

        });

        this.BuscarDados();
      });
  }

  Adicionar() {

    if (this.filho.nome && this.filho.dataNascimento && this.filhoMembro > 0) {

      const body = {
        id: this.filho.id,
        dataCriacao: new Date,
        nome: this.filho.nome,
        dataNascimento: this.filho.dataNascimento,
        membro: this.filhoMembro == 1 ? true : false,
        idPai: this.filho.idPai ? Number(this.filho.idPai) : null,
        idMae: this.filho.idMae ? Number(this.filho.idMae) : null,
        igrejaId : this.auth.dadosUsuario.IgrejaLogada
      }

      this.serviceApi.create(body, Endpoint.Filhos)
        .subscribe(x => {
          this.serviceUtil.showMessage('Cadastro realizado com sucesso!', false)
          this.CarregarComboPaiMae();
          this.filho = new ViewFilhos()
        });

    } else {
      this.serviceUtil.showMessage('Obrigatório os campos, Nome, Data de Nascimento e se é Membro', false)
    }
  }

  Editar(id: string) {

    this.serviceApi.readById(id, Endpoint.Filhos)
      .subscribe((result: any) => {
        if (result) {

          this.filho.id = result.id;
          this.filho.dataNascimento = result.dataNascimento;
          this.filhoMembro = result.membro ? 1 : 2;
          this.filho.nome = result.nome;
          this.filho.idMae = result.idMae;
          this.filho.idPai = result.idPai;
        }
      });
  }

  Excluir(id: number) {

    this.serviceApi.create(id, Endpoint.Filhos + '/excluir')
      .subscribe(() => {
        this.serviceUtil.showMessage('Cadastro realizado com sucesso!', false)
        this.BuscarDados();
      });

  }

  FilhoSelecionado(id: number) {

  }

  public Filtros(keyEvent: any): void {
    if (keyEvent.which === 13 || keyEvent.which === 1) {
      this.txtBusca = (<HTMLSelectElement>document.getElementById('txtBusca')).value;

      this.BuscarDados();
    }
  }
}
