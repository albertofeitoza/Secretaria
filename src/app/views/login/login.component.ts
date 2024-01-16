import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { login } from 'src/app/models/modelLogin';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  sessao: login = new login()
  isLoggedIn : boolean = false;
  userPassword : string  = ""
  constructor(
    private auth: AutenticacaoService
  ) {

  }

    ngOnInit(){
      this.auth.autenticado.subscribe(response => {
        this.isLoggedIn = response
      })
      this.sessao = new login()
    }
      

  login(event: any) {
    if (event.which === 13 || event.which == 1) {
        this.auth.Autenticado(this.sessao)

    }
  }
}
