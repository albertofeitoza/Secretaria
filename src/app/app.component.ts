import { Component } from '@angular/core';
import { AutenticacaoService } from './services/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Secretaria.';

  isLoggedIn: boolean = false;

  constructor(private auth: AutenticacaoService,
    private router : Router
    ) { }

  ngOnInit(): void {
    this.login()
  }


  login() {
    this.router.navigate(['/']);
    this.auth.autenticado.subscribe(
      checLogin => this.isLoggedIn = checLogin
    );
  }
}
