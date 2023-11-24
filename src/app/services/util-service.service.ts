import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, EMPTY, catchError, map } from 'rxjs';
import { Component, EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    public overlay: Overlay,
    public dialog: MatDialog,) { }

  showMessage(msg: string, isErro: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isErro ? ['msg-error'] : ['msg-sucess']
    })

  }

  erroHandler(e: any): Observable<any> {
    let mensagem = e.error;
    this.showMessage(e.error, true)
    return EMPTY
  }

  convertToBase64(txt: string): string {
    return btoa(txt);
  }

  convertBase64toText(txt: string): string {
    return atob(txt);

  }

  EstCivil() {
    let estCivil = []
    estCivil.push({ "id": 0, "value": "Selecione" })
    estCivil.push({ "id": 1, "value": "Solteiro" })
    estCivil.push({ "id": 2, "value": "Primeiro Casamento" })
    estCivil.push({ "id": 3, "value": "Segundo Casamento Viuvo" })
    estCivil.push({ "id": 4, "value": "Segundo Casamento Divorciado" })
    estCivil.push({ "id": 5, "value": "Viuvo" })
    estCivil.push({ "id": 6, "value": "Separado" })
    estCivil.push({ "id": 7, "value": "Divorciado" })

    return estCivil
  }

  GrauInstrucao() {

    let grauInstrucao = [];

    grauInstrucao.push({ "id": 0, "value": "Selecione" })
    grauInstrucao.push({ "id": 1, "value": "Analfabeto" })
    grauInstrucao.push({ "id": 2, "value": "Ensino Fundamental" })
    grauInstrucao.push({ "id": 3, "value": "Primeiro Grau Completo" })
    grauInstrucao.push({ "id": 4, "value": "Primeiro Grau InCompleto" })
    grauInstrucao.push({ "id": 5, "value": "Segundo Grau Completo" })
    grauInstrucao.push({ "id": 6, "value": "Segundo Grau InCompleto" })
    grauInstrucao.push({ "id": 7, "value": "Superior Completo" })
    grauInstrucao.push({ "id": 8, "value": "Superior InCompleto" })

    return grauInstrucao;

  }

  Sexo() {
    let sexo = [];
    sexo.push({ "id": 0, "value": "selecione" })
    sexo.push({ "id": 1, "value": "Masculino" })
    sexo.push({ "id": 2, "value": "Feminino" })
    sexo.push({ "id": 3, "value": "Indefinido" })

    return sexo;
  }

  StatusPessoa() {

    let statusPessoa = [];

    statusPessoa.push({ "id": 0, "value": "selecione" })
    statusPessoa.push({ "id": 1, "value": "Em Comunhao" })
    statusPessoa.push({ "id": 2, "value": "Afastado" })
    statusPessoa.push({ "id": 3, "value": "Disciplinado" })
    statusPessoa.push({ "id": 4, "value": "Excluído" })

    return statusPessoa
  }

  CursoTeologico(){
    let cursoteoligico = [];
    cursoteoligico.push({ "id": 0, "value": "selecione" })
    cursoteoligico.push({ "id": 1, "value": "Basico" })
    cursoteoligico.push({ "id": 2, "value": "Medio" })
    cursoteoligico.push({ "id": 3, "value": "Bacharel" })
    cursoteoligico.push({ "id": 4, "value": "Doutorado" })
    
    return cursoteoligico
  }

  Funcao(){
    let funcao = [];
    funcao.push({ "id": 0, "value": "selecione" })
    funcao.push({ "id": 1, "value": "Membro" })
    funcao.push({ "id": 2, "value": "Cooperador" })
    funcao.push({ "id": 3, "value": "Diacono" })
    funcao.push({ "id": 4, "value": "Presbitero" })
    funcao.push({ "id": 5, "value": "Pastor" })
    funcao.push({ "id": 6, "value": "Evangelista" })
    funcao.push({ "id": 7, "value": "Missionario" })

    return funcao
  }

  EntradaFuncao(){
    let entradaFuncao = [];
    entradaFuncao.push({ "id": 0, "value": "selecione" })
    entradaFuncao.push({ "id": 1, "value": "Apresentado" })
    entradaFuncao.push({ "id": 2, "value": "Consagrado" })
    entradaFuncao.push({ "id": 3, "value": "Recebido" })
    entradaFuncao.push({ "id": 3, "value": "Reintegrado" })
   
    return entradaFuncao
  }
}
