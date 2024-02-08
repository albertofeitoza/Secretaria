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

  usuario: Usuario = new Usuario();
  cpf: any
  tipousuarios: any[]
  pessoa: Pessoa = new Pessoa()


  constructor(
    private utilService: UtilServiceService,
    private serverApi: AllservicesService<any>
  ) {

  }

  ngOnInit() {
    this.CarregarCombos()

  }

  CarregarCombos() {
    this.tipousuarios = this.utilService.TipoUsuario()
  }

  Filtros() {
    
    this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf).subscribe(res => {

      if (res.code == 200)
        this.pessoa = res.data;
      else
        this.utilService.showMessage("Cpf não cadastrado", true);

    })

  }

  SalvarUsuario(){
   
    if(this.pessoa != null)
    {
      this.usuario.id = 0;
      this.usuario.dominio = "Ferrazopolis";
      this.usuario.id = 0;
      this.usuario.pessoaId = this.pessoa.id

      this.serverApi.create(this.usuario, Endpoint.Usuario).subscribe(x => {
        this.utilService.showMessage("Usuário cadastrado com sucesso", true);
        

      })

    }
    



    
  }

}
