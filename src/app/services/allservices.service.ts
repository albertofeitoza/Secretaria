import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { AutenticacaoService } from './autenticacao.service';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilServiceService } from './util-service.service';
import { Cartas } from '../models/Cartas';
import { Filtros } from '../models/Filtros';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumento } from '../enum/TipoDocumento';
import { Endpoint } from '../enum/Endpoints';

@Injectable({
  providedIn: 'root'
})
export class AllservicesService<T> {

  environmentUrl = ''
  public idMembro: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService: UtilServiceService,
    private loginService: AutenticacaoService,
    private toast: ToastrService

  ) {
    this.environmentUrl = environment.BASE_URL
  }

  EnviarArquivoServidor(formData: any, endpoint: string, filtros: any = null): Observable<any> {
    return this.http.post(this.environmentUrl + endpoint, formData, this.loginService.HeaderForFile(filtros))
      .pipe(
        map(res => res)
      )
  }

  DownloadArquivo(id: string, endpoint: string, token: string = "", filtros: string = ""): Observable<any> {
    const url = id != '' ? `${this.environmentUrl + endpoint}/${id}` : `${this.environmentUrl + endpoint}`
    return this.http.get(url, { responseType: 'blob', headers: this.loginService.Header(filtros).headers })
      .pipe(
        map(res => res)
      )
  }

  DownloadCartas(dados: Cartas, endpoint: string, filtros: string = ""): Observable<any> {

    let url = `${this.environmentUrl + endpoint}?IdPessoa=${dados.idPessoa}&TipoRelatorio=${dados.tipoRelatorio}`;

    if (dados.cidade)
      url += `${'&Cidade=' + dados.cidade}`;

    if (dados.estado)
      url += `${'&Estado=' + dados.estado}`;

    if (dados.igrejaDestino)
      url += `${'&IgrejaDestino=' + dados.igrejaDestino}`;

    if (dados.idNovoPastor)
      url += `${'&IdNovoPastor=' + dados.idNovoPastor}`;

    if (dados.nomeNovoPastor)
      url += `${'&NomeNovoPastor=' + dados.nomeNovoPastor}`;

    if (dados.idIgrejaInterna > 0)
      url += `${'&IdIgrejaInterna=' + dados.idIgrejaInterna}`

    return this.http.get(url, { responseType: 'blob', headers: this.loginService.Header(filtros).headers })
      .pipe(
        map(res => res),
        catchError(e => this.utilService.erroHandler('Erro ao realizar o download tente novamente'))
      )
  }

  //Criar Cadastro
  create(T: T, endpoint: string, message: string = ""): Observable<T> {
    return this.http.post<T>(this.environmentUrl + endpoint, T, this.loginService.Header()).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  read(endpoint: string, filtros: string = ""): Observable<T[]> {
    let url = this.environmentUrl + endpoint;
    return this.http.get<T[]>(`${this.environmentUrl + endpoint}`, this.loginService.Header(filtros)).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  readById(id: string, endpoint: string, filtros: string = "", igreja: number = 0): Observable<T> {

    let url = `${this.environmentUrl + endpoint}/${id}`;

    if (igreja > 0) {
      url = `${url}/${igreja}`
    }


    return this.http.get<T>(url, this.loginService.Header(filtros)).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  update(T: T, endpoint: string, token: string = ""): Observable<T> {
    return this.http.put<T>(this.environmentUrl + endpoint, T, this.loginService.Header()).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  delete(id: number, endpoint: string, motivo: string = ""): Observable<T> {
    const url = `${this.environmentUrl + endpoint}/${id}`
    return this.http.delete<T>(url, this.loginService.Header()).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    )
  }

  // Buscar CEP na internet
  buscarExterna(url: string): Observable<T> {
    return this.http.get<T>(`${url}`).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

}
