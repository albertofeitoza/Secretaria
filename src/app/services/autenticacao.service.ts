
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
import { jwtDecode } from 'jwt-decode';
import { TokenResponse } from '../models/token';
import { DadosLogados } from '../models/Usuario';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumento } from '../enum/TipoDocumento';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  primeiroAcesso = new EventEmitter<boolean>();
  token = new EventEmitter<string>();
  dadosUsuario: DadosLogados = new DadosLogados();


  environmentUrl = ''
  sair: string = "";

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService: UtilServiceService,
    private toast: ToastrService

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
        catchError(e => this.utilService.erroHandler('Api Indisponível'))
      )
      .subscribe(result => {
        if (result.code === 200) {


          this.primeiroAcesso.emit(false);
          this.token = result?.data;
          this.autenticado.emit(true);
          this.getDecodedAccessToken(result?.data)
          this.router.navigate(['/']);
          this.toast.info(result?.mensagem)

        } else if (result.code === 203) {

          this.primeiroAcesso.emit(true);

        }
        else {
           this.toast.error(result.mensagem)
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

  HeaderForFile(fileName: string, idPessoa: number, tipoDocumento: TipoDocumento, idDocumento: number) {
    const headers = new HttpHeaders({
      'filename': fileName,
      'idpessoa': idPessoa,
      'idDocumento': idDocumento,
      'tipoDocumento': tipoDocumento,
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
    this.dadosUsuario.TipoIgrejaLogada = this.dadosUsuario.TipoUsuarioLogado === 1 ? 1 : Number(jwtDecode<TokenResponse>(token).unique_name[4]);
    let teste = 1;

  }
}
