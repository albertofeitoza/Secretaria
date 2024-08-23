import { Component, OnInit } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { igreja } from 'src/app/models/Igreja';
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



  igrejas: igreja[] = new Array();
  igreja: igreja = new igreja();
  ColunasIgreja = ['id', 'nome', 'estado', 'cidade', 'action'];
  linhaSelecionada = 0;

  constructor(
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private auth : AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.BuscarIgrejas();
  }

  public EditarIgreja(id: number): void {
    this.serviceUtil.PopupConfirmacao("", TipoPopup.ComponenteInstancia, AdicionarIgrejaComponent, id, '25%', '30%')
      .subscribe(() => {
        this.BuscarIgrejas();
      });
  }

  public BuscarIgrejas(): void {
    this.serviceApi.read(Endpoint.Igreja + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: igreja[]) => {
        this.igrejas = result;
      });
  }

  public CadastrarIgreja(): void {
    this.serviceUtil.PopupConfirmacao("", TipoPopup.ComponenteInstancia, AdicionarIgrejaComponent, 0, '25%', '30%')
      .subscribe(() => {
        this.BuscarIgrejas();
      });
  }

  public LinhaSelecionada(id: number): void {
    return;
  }


  public Usuarios(element: any): void {
    this.serviceUtil.PopupConfirmacao("", TipoPopup.ComponenteInstancia, UsuariosComponent, element.id, '50%', '70%', false, false, element);
  }
  
  
  public Pastores(element: any): void {
    this.serviceUtil.PopupConfirmacao("", TipoPopup.ComponenteInstancia, PastoresComponent, element.id, '50%', '70%', false, false, element);
  }
}
