import { PopperOptions } from './../../../../node_modules/popper.js/index.d';
import { Component, OnInit } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { igreja, ViewIgreja } from 'src/app/models/Igreja';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { AdicionarIgrejaComponent } from './modal/adicionar-igreja/adicionar-igreja.component';
import { PastoresComponent } from './modal/pastores/pastores.component';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-igreja',
  templateUrl: './igreja.component.html',
  styleUrls: ['./igreja.component.css']
})
export class IgrejaComponent implements OnInit {



  igrejas: ViewIgreja[] = new Array();
  igreja: igreja = new igreja();
  ColunasIgreja = ['id', 'nome', 'nomeIgrejaMae', 'dominio', 'estado', 'cidade', 'status', 'action'];
  linhaSelecionada = 0;

  constructor(
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private auth: AutenticacaoService
  ) { }

  ngOnInit(): void {
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
        this.igrejas = new Array();
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

          this.igrejas.push(viewIgreja)
        });
        this.igrejas = [...this.igrejas];
      });
  }

  public CadastrarIgreja(): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, AdicionarIgrejaComponent, 0, '35%', '50%')
      .subscribe(() => {
        this.BuscarIgrejas();
      });
  }

  public LinhaSelecionada(id: number): void {
    return;
  }


  public Usuarios(element: any): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, UsuariosComponent, element.id, 'auto', 'auto', false, false, element);
  }


  public Pastores(element: any): void {
    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, PastoresComponent, element.id, '80%', 'auto', false, false, element);
  }

  public Excluir(element: any) : void {
    
  }
}
