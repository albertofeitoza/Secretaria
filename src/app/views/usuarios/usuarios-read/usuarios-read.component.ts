import { UsuariosEditarComponent } from './../modal/editar/usuarios-editar/usuarios-editar.component';
import { Component, OnInit } from '@angular/core';
import { ViewUsuarios } from '../model/viewUsuarios';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { UsuariosComponent } from '../modal/Adicionar/usuarios.component';

@Component({
  selector: 'app-usuarios-read',
  templateUrl: './usuarios-read.component.html',
  styleUrls: ['./usuarios-read.component.css']
})
export class UsuariosReadComponent implements OnInit {

  Colunas = ['id', 'nome', 'nomeUsuario', 'tipoUsuario', 'ativo', 'primeiroAcesso', 'action'];
  spinner = false;
  usuarios: ViewUsuarios[] = new Array();
  linhaSelecionada = 0;
  igrejaSelecionada = 0;


  constructor(
    private matdialogRef: MatDialogRef<UsuariosReadComponent>,
    private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private auth: AutenticacaoService
  ) {

  }
  ngOnInit() {
    this.igrejaSelecionada = Number(this.matdialogRef.id);
    this.BuscarUsuarios();
  }


  private BuscarUsuarios(): void {
    this, this.serverApi.read(Endpoint.Usuario + `/estabelecimento/${this.igrejaSelecionada}`)
      .subscribe((result: ViewUsuarios[]) => {

        this.usuarios = result;
      })
  }

  AdicionarUsuario() {

    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, UsuariosComponent, 0, 'auto', 'auto', false, false, this.igrejaSelecionada)
      .subscribe(() => {
        this.BuscarUsuarios();
      });

  }

  EditarUsuario(row: any) {

    this.serviceUtil.Popup("", TipoPopup.ComponenteInstancia, UsuariosEditarComponent, 0, 'auto', 'auto', false, false, row)
      .subscribe(() => {
        this.BuscarUsuarios();
      });
  }

  LinhaSelecionada(id: any) {

  }

}
