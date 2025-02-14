import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/enum/Endpoints';
import { ResetSenha, Usuario } from 'src/app/models/Usuario';
import { login } from 'src/app/models/modelLogin';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

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
  InfBotao: string = "Enviar CPF";
  dadosResetSenha: ResetSenha = new ResetSenha()
  igrejas: any[] = new Array();
  constructor(
    private auth: AutenticacaoService,
    private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>  ) {

  }

  ngOnInit() {
    this.sessao = new login()
    this.auth.autenticado.subscribe(response => {
      this.isLoggedIn = response
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
            this.serviceUtil.showMessage(response.data.mensagem, true)
        })
    }

    if (this.sequenciaTelaReset == 2) {

      if (!this.dadosResetSenha.cpf) {
        this.serviceUtil.showMessage("Cpf Obrigatório", true)
        return
      }

      if (!this.dadosResetSenha.token) {
        this.serviceUtil.showMessage("Token recebido por e-mail Obrigatório", true)
        return
      }

      if (!this.dadosResetSenha.novaSenha) {
        this.serviceUtil.showMessage("Nova senha obrigatoria", true)
        return
      }

      if (!this.dadosResetSenha.novaSenhaConfirm) {
        this.serviceUtil.showMessage("Nova senha de confirmação obrigatoria", true)
        return
      }
      if (this.dadosResetSenha.novaSenha != this.dadosResetSenha.novaSenhaConfirm) {
        this.serviceUtil.showMessage("A senha nova está diferente da confirmação de senha", true)
        return
      }

      this.serverApi.create(this.dadosResetSenha, Endpoint.ResetSenha)
        .subscribe(response => {
          this.serviceUtil.showMessage(response.data.mensagem, true)
          this.dadosResetSenha = new ResetSenha();
          this.sessao = new login()
          this.esqueciSenha = false
        })
    }

  }

  AlterarSenha() {

  }

  Registrar(): void {
   //this.serviceUtil.Popup()
    
  }
}
