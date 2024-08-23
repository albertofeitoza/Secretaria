import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';




@Component({
  selector: 'app-bem-vindo',
  templateUrl: './bem-vindo.component.html',
  styleUrls: ['./bem-vindo.component.css']
})
export class BemVindoComponent implements OnInit {
  tipoUsuario : Number = 0;
  constructor(private auth : AutenticacaoService) {
    
  }

  ngOnInit() {
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
  }
}

