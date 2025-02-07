import { EventEmitter, Injectable } from '@angular/core';
import { login } from '../models/modelLogin';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, catchError, take } from 'rxjs/operators';
import { UtilServiceService } from './util-service.service';
import { Endpoint } from '../enum/Endpoints';
import { ApiResponse } from '../models/ApiResponse';
//import * as jwt_decode from 'jwt-decode';
import { JwtDecodeOptions, JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import { TokenResponse } from '../models/token';
import { Observable } from 'rxjs';
import { DadosLogados } from '../models/Usuario';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  token = new EventEmitter<string>();
  dadosUsuario: DadosLogados = new DadosLogados();


  environmentUrl = ''
  sair: string = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService: UtilServiceService

  ) {
    this.environmentUrl = environment.BASE_URL;
  }

  Autenticado(sessao: login) {
    this.logoof()
    this.loginSistema(sessao, Endpoint.Token)
  }

  logoof() {
    this.router.navigate(['/']);
    this.autenticado.emit(false);
    this.token = new EventEmitter<string>()
  }

  loginSistema(sessao: login, endpoint: string) {

    this.http.post<ApiResponse>(this.environmentUrl + endpoint, sessao)
      .pipe(
        map(obj => obj),
        catchError(e => this.utilService.erroHandler(this.utilService.showMessage("Api Indisponível", true))),
      )
      .subscribe(result => {
        if (result.code === 200) {
          this.token = result.data;
          this.autenticado.emit(true);
          this.getDecodedAccessToken(result.data)
          this.router.navigate(['/']);
          this.utilService.showMessage(result.mensagem, false)
        } else {
          this.utilService.showMessage(result.mensagem, true)
        }
      });
  }

  Header(filtros: string = "") {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'filtros': `${filtros}`
    });

    return { headers: headers };
  }

  HeaderForFile(fileName: string) {
    const headers = new HttpHeaders({
      'filename': fileName,
      'Authorization': `Bearer ${this.token}`
    });
    return { headers: headers };
  }

  private getDecodedAccessToken(token: string): void {

    this.dadosUsuario = new DadosLogados();

    this.dadosUsuario.LoginSistema = jwtDecode<TokenResponse>(token).unique_name[0];
    this.dadosUsuario.TipoUsuarioLogado = Number(jwtDecode<TokenResponse>(token).unique_name[1]);
    this.dadosUsuario.NomeUsuarioLogado = jwtDecode<TokenResponse>(token).unique_name[2];
    this.dadosUsuario.IgrejaLogada = this.dadosUsuario.TipoUsuarioLogado === 1 ? 0 : Number(jwtDecode<TokenResponse>(token).unique_name[3]);
  }
}
