import { Component } from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Usuario } from 'src/app/models/Usuario';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {


  usuarios: Usuario[] = new Array()

  usuario: Usuario = new Usuario();
  cpf: any
  tipousuarios: any[]
  pessoa: Pessoa = new Pessoa()
  spinner: boolean = false;
  linhaSelecionada: number = 0

  Colunas = ['id', 'nomeUsuario', 'dominio', 'action']

  constructor(
    private utilService: UtilServiceService,
    private serverApi: AllservicesService<any>
  ) {

  }

  ngOnInit() {
    this.CarregarCombos()
    this.BuscaUsuarios()

  }

  CarregarCombos() {
    this.tipousuarios = this.utilService.TipoUsuario()
  }

  Filtros(keyEvent: any) {

    if (keyEvent.which == 13 || keyEvent.which == 1) {

      if (this.cpf) {
        this.serverApi.readById(this.cpf, Endpoint.BuscaPorCpf).subscribe(res => {
          if (res.code == 200)
            this.pessoa = res.data;
          else
            this.utilService.showMessage("Cpf não cadastrado", true);
          this.cpf = ""
        })
      } else
        this.utilService.showMessage("Informe o cpf.", true);
    }
  }

  SalvarUsuario() {
    if (this.usuario.nomeUsuario != null && this.usuario.senha != null || this.usuario.senha != "******" && this.usuario.tipoUsuario > 0) {

      if (this.pessoa != null && this.pessoa.nome != null) {
        this.usuario.dominio = "Ferrazopolis";
        this.usuario.pessoaId = this.pessoa.id
        this.serverApi.create(this.usuario, Endpoint.Usuario).subscribe(x => {

          this.utilService.showMessage("Usuário cadastrado com sucesso.", true);

        })
      }
    }
  }

  BuscaUsuarios() {
    this.serverApi.read(Endpoint.Usuario)
      .subscribe(response => {
        this.usuarios = response
      })
  }

  BuscarUsuarioPorId(id: any) {
    this.serverApi.readById(id, Endpoint.Usuario)
      .subscribe(res => {
        this.usuario = res.data
        this.pessoa = res.data.pessoa
      }
      )

  }

  LinhaSelecionada(id: any) {
    this.linhaSelecionada = id;
  }

}
