import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Usuario } from 'src/app/models/Usuario';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-usuarios-editar',
  templateUrl: './usuarios-editar.component.html',
  styleUrls: ['./usuarios-editar.component.css']
})
export class UsuariosEditarComponent implements OnInit {

  tipousuarios: any[]
  usuario: Usuario = new Usuario();

  constructor(
    private matdialogRef: MatDialogRef<UsuariosEditarComponent>,
    private utilService: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private auth: AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.CarregarCombos()
    this.CarregarUsuario(this.matdialogRef._containerInstance._config.data.dadosTela.id)
  }

  private CarregarUsuario(id: any): void {
    this.serverApi.readById(id, Endpoint.Usuario)
      .subscribe(res => {
        this.usuario = res.data
      });
  }

  private CarregarCombos(): void {
    this.tipousuarios = this.utilService.TipoUsuario()
  }

  public Salvar(): void {
    this.usuario.primeiroAcesso = this.usuario.senha ? true : false;

    this.serverApi.create(this.usuario, Endpoint.Usuario)
      .subscribe(() => {
        this.utilService.showMessage(`Dados Alterados com sucesso`, false)
        this.matdialogRef.close();
      });
  }
}

