import { EventEmitter, Injectable } from '@angular/core';
import { EMPTY, Observable, empty } from 'rxjs';
import { login } from '../models/modelLogin';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, catchError, take } from 'rxjs/operators';
import { UtilServiceService } from './util-service.service';
import { Endpoint } from '../enum/Endpoints';
import { ApiResponse } from '../models/ApiResponse';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  token: string
  environmentUrl = ''

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService: UtilServiceService

  ) {
    this.environmentUrl = environment.BASE_URL;
  }

  Autenticado(sessao: login) {
    try {
      this.logoof()
      this.loginSistema(sessao, Endpoint.Token)
    } catch (error) {
      console.log("Teste")
    }


  }

  logoof() {
    this.autenticado.emit(false);
    this.token = "";
  }

  loginSistema(T: login, endpoint: string) {

    this.logoof()
    this.http.post<ApiResponse>(this.environmentUrl + endpoint, T,).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e)),
    ).subscribe(ret => {
      if (ret.code === 200) {
        this.token = ret.data;
        this.autenticado.emit(true);
        this.router.navigate(['/']);
        this.utilService.showMessage(ret.mensagem, false)
      } else
        this.utilService.showMessage(ret.mensagem, true)
    })
  }

  Header() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return { headers: headers };
  }
}
