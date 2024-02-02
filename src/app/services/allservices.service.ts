import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AutenticacaoService } from './autenticacao.service';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilServiceService } from './util-service.service';
import { Filtros } from '../models/Filtros';



@Injectable({
  providedIn: 'root'
})
export class AllservicesService<T> {

  environmentUrl = ''

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilService: UtilServiceService,
    private loginService: AutenticacaoService

  ) {
    this.environmentUrl = environment.BASE_URL
  }

  EnviarArquivoServidor(T: any, endpoint: string, fileName: string): Observable<T> {
    let headers = this.loginService.HeaderForFile(fileName).headers;
    const uploadReq = new HttpRequest('POST', this.environmentUrl + endpoint, T,
      {
        reportProgress: true,
        headers: headers
      });

    return this.http.request(uploadReq).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }
  DownloadArquivoPdf(id: string, endpoint: string, token: string = "") : Observable<any> {
    const url = `${this.environmentUrl + endpoint}/${id}`
    return this.http.get(url, { responseType : 'blob', headers : this.loginService.Header().headers} )
    .pipe(
      map(res => res)
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
    return this.http.get<T[]>(`${this.environmentUrl + endpoint}`, this.loginService.Header()).pipe(
      map(obj => obj),
      catchError(e => this.utilService.erroHandler(e))
    );
  }

  readById(id: string, endpoint: string, filtros: string = ""): Observable<T> {
    const url = `${this.environmentUrl + endpoint}/${id}`

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
    const url = `${this.environmentUrl + endpoint}/${id}/${motivo}`
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
