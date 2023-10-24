import { Component } from '@angular/core';
import { AutenticacaoService } from './services/autenticacao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Secretaria.';

  isLoggedIn: boolean = false;

  constructor(private auth: AutenticacaoService) { }

  ngOnInit(): void {
    this.login()
  }


  login() {

    this.auth.autenticado.subscribe(
      checLogin => this.isLoggedIn = checLogin
    );
  }
}
