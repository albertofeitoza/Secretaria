import { PopperOptions } from './../../../../node_modules/popper.js/index.d';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { igreja, ViewIgreja } from 'src/app/models/Igreja';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { UsuariosComponent } from '../usuarios/modal/Adicionar/usuarios.component';
import { AdicionarIgrejaComponent } from './modal/adicionar-igreja/adicionar-igreja.component';
import { PastoresComponent } from './modal/pastores/pastores.component';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosReadComponent } from '../usuarios/usuarios-read/usuarios-read.component';

@Component({
  selector: 'app-igreja',
  templateUrl: './igreja.component.html',
  styleUrls: ['./igreja.component.css']
})
export class IgrejaComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  igrejas = new MatTableDataSource<any>();

  //igrejas: ViewIgreja[] = new Array();
  igreja: igreja = new igreja();
  ColunasIgreja = ['id', 'nome', 'nomeIgrejaMae', 'dominio', 'estado', 'cidade', 'status', 'action'];
  linhaSelecionada = 0;
  txtBusca = '';

  constructor(
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private auth: AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.txtBusca = ''
    this.BuscarIgrejas();

  }

  public EditarIgreja(id: number): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, AdicionarIgrejaComponent, id, '35%', '50%')
      .subscribe(() => {

        this.BuscarIgrejas();
      });
  }

  public BuscarIgrejas(): void {
    //refazer o Array
    this.serviceApi.read(Endpoint.Igreja + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: igreja[]) => {
        this.igrejas.data = new Array();

        result = result.filter(x => this.txtBusca != '' ? x.nome.toLowerCase().includes(this.txtBusca.toLowerCase()) : result)
        
        this.txtBusca = '';
        
        result.forEach(igr => {

          let viewIgreja: ViewIgreja = new ViewIgreja()
          viewIgreja.id = igr.id
          viewIgreja.nome = igr.nome;
          viewIgreja.nomeIgrejaMae = result.filter(x => x.id === igr.igrejaMae).map(x => x.nome)[0];
          viewIgreja.cnpj = igr.cnpj;
          viewIgreja.estado = igr.estado;
          viewIgreja.cidade = igr.cidade;
          viewIgreja.igrejaMae = igr.igrejaMae;
          viewIgreja.status = igr.status;
          viewIgreja.dominio = igr.dominio;

          this.igrejas.data.push(viewIgreja)
        });
        this.igrejas.data = [...this.igrejas.data];
      });

    this.igrejas.paginator = this.paginator
    this.igrejas.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";

  }

  public CadastrarIgreja(): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, AdicionarIgrejaComponent, 0, '35%', '50%')
      .subscribe(() => {
        this.BuscarIgrejas();
      });
  }

  public BuscarIgreja(event: any): void {

    if (event.which === 13 || event.which === 1) {
      this.txtBusca = (<HTMLSelectElement>document.getElementById('txtbusca')).value;
      this.BuscarIgrejas();
    }
  }


  public LinhaSelecionada(id: number): void {
    return;
  }


  public Usuarios(element: any): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, UsuariosReadComponent, element.id, '65%', '55%', false, false, element);
  }


  public Pastores(element: any): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, PastoresComponent, element.id, '80%', 'auto', false, false, element);
  }

}
