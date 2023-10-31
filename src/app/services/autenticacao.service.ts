import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { login } from '../models/modelLogin';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Endpoint } from '../enum/Endpoints';
import { map, catchError, take } from 'rxjs/operators';
import { UtilServiceService } from './util-service.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  autenticado = new EventEmitter<boolean>();
  token = new EventEmitter<string>();
  environmentUrl = ''

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService : UtilServiceService

  ) {
    this.environmentUrl = environment.BASE_URL;
  }


  Autenticado(sessao: login) {
    this.loginSistema(sessao, Endpoint.Token).subscribe(x => {
      this.token.emit(x.toString());
      this.autenticado.emit(true);
      this.router.navigate(['/']);

    })

  }
  logoof() {
    this.autenticado.emit(false);
  }

  public loginSistema(T : login, endpoint: string) : Observable <any>{
    return this.http.post<any>(this.environmentUrl + endpoint , T,).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  Header() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${this.token}`
    });
    return { headers: headers };
  }

}
