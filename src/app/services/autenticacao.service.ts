import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { login } from '../models/modelLogin';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  constructor(private router : Router) { }


  Autenticado(sessao: login) {

    if (sessao.dominio == 'Ferra' && sessao.usuario == 'admin' && sessao.senha == '123456') {
      this.autenticado.emit(true);
      this.router.navigate(['/']);
    }
  }

  logoof() {
    this.autenticado.emit(false);
  }
}
