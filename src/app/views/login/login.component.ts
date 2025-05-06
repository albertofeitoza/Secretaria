import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/enum/Endpoints';
import { ResetSenha, Usuario } from 'src/app/models/Usuario';
import { login } from 'src/app/models/modelLogin';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { OrganogramaComponent } from '../organograma/organograma.component';
import { CadastreSeComponent } from '../cadastre-se/cadastre-se.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  sessao: login = new login()
  isLoggedIn: boolean = false;
  userPassword: string = ""
  esqueciSenha: boolean = false
  usuario: Usuario = new Usuario()
  pessoa: Pessoa = new Pessoa()
  sequenciaTelaReset: number = 1;
  InfBotao: string = "Enviar";
  dadosResetSenha: ResetSenha = new ResetSenha()
  primeiroAcesso = false;
  constructor(
    private auth: AutenticacaoService,
    private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private toast: ToastrService) {

  }

  ngOnInit() {
    this.sessao = new login()

    this.auth.autenticado
      .subscribe(response => {
        this.isLoggedIn = response
      })

    this.auth.primeiroAcesso
      .subscribe(response => {
        this.primeiroAcesso = response
      })

  }

  login(event: any) {

    if (event.which === 13 || event.which == 1) {
      this.auth.Autenticado(this.sessao)
    }
  }

  EsqueciSenha(event: any) {
    this.esqueciSenha = true;
  }

  EnviaDados(event: any) {

    if (this.sequenciaTelaReset == 1) {
      this.serverApi.create(this.dadosResetSenha, Endpoint.ResetSenha)
        .subscribe(response => {
          if (response.data.code == 200 && this.sequenciaTelaReset == 1 && response.data.mensagem == 'enviado') {
            this.InfBotao = "Enviar Dados"
            this.sequenciaTelaReset = response.data.data.sequencia
            this.dadosResetSenha.idUsuario = response.data.data.idUsuario
            this.dadosResetSenha.sequencia = response.data.data.sequencia
          }
          else
            this.toast.success(response.data.mensagem)
        })
    }

    if (this.sequenciaTelaReset == 2) {

      if (!this.dadosResetSenha.email) {
        this.toast.warning("Cpf Obrigatório")
        return
      }

      if (!this.dadosResetSenha.token) {
        this.toast.info("Token recebido por e-mail Obrigatório")
        return
      }

      if (!this.dadosResetSenha.novaSenha) {
        this.toast.warning("Nova senha obrigatoria")
        return
      }

      if (!this.dadosResetSenha.novaSenhaConfirm) {
        this.toast.warning("Nova senha de confirmação obrigatoria")
        return
      }
      if (this.dadosResetSenha.novaSenha != this.dadosResetSenha.novaSenhaConfirm) {
        this.toast.warning("A senha nova está diferente da confirmação de senha")
        return
      }

      this.serverApi.create(this.dadosResetSenha, Endpoint.ResetSenha)
        .subscribe(response => {
          this.toast.success(response.data.mensagem)
          this.dadosResetSenha = new ResetSenha();
          this.sessao = new login()
          this.esqueciSenha = false
        })
    }

  }

  AlterarSenha() {

  }

  Registrar(): void {
    this.serviceUtil.Popup('Bem Vindo!', 0, CadastreSeComponent, 0, '100%', '100%', true);
  }
}
