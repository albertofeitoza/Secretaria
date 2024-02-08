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
import {JwtDecodeOptions, JwtHeader, JwtPayload, jwtDecode} from 'jwt-decode';
import { TokenResponse } from '../models/token';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  token = new EventEmitter<string>();
  public tipoUsuarioLogado : Number = 0;

  environmentUrl = ''
  sair : string = "";
  
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
      console.log("Erro ao acessar a API")
    }


  }

  logoof() {
    this.router.navigate(['/']);
    this.autenticado.emit(false);
    this.token = new EventEmitter<string>()
  }

  loginSistema(T: login, endpoint: string) {
    this.http.post<ApiResponse>(this.environmentUrl + endpoint, T,).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e)),
    ).subscribe(ret => {
      if (ret.code === 200) {
        this.token = ret.data;
        this.autenticado.emit(true);
        this.tipoUsuarioLogado = this.getDecodedAccessToken(ret.data)
        this.router.navigate(['/']);
        this.utilService.showMessage(ret.mensagem, false)
      } else
        this.utilService.showMessage(ret.mensagem, true)
    })
  }

  Header(filtros : string = ""){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'filtros' : `${filtros}`
    });
    
    return { headers: headers };
  }

  HeaderForFile(fileName : string){
    const headers = new HttpHeaders({
      'filename' : fileName,
      'Authorization': `Bearer ${this.token}`
    });
    return { headers: headers };
  }

  getDecodedAccessToken(token: string): any {
    try {
      return Number(jwtDecode<TokenResponse>(token).unique_name[1])
    } catch(Error) {
      return null;
    }
  }

}
