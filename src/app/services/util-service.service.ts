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
    public dialog: MatDialog
  ) { }

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

  convertToBase64(data: any){
    return btoa(data);
  }

  convertBase64toText(txt: string): string {
    return atob(txt);

  }

  Imprimir(result : any, type : string){
    const blob = new Blob([result], { type: type });
    var fileURL = URL.createObjectURL(blob);

    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.style.display = 'none';
    iframe.src = fileURL;
    iframe.onload = function () {
      setTimeout(function () {
        iframe.focus();
        iframe.contentWindow?.print();
      }, 2);
    };
  }

  BaixarArquivo(result : any, type : string, nomeArquivo : string) {
    
    const blob = new Blob([result], { type: type });
    var fileURL = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = fileURL;
    a.download = nomeArquivo == undefined ? blob.text.name : nomeArquivo
    a.click();

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
    grauInstrucao.push({ "id": 9, "value": "Mestrado" })

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
    statusPessoa.push({ "id": 4, "value": "Excluído da comunhão" })

    return statusPessoa
  }

  CursoTeologico() {
    let cursoteoligico = [];
    cursoteoligico.push({ "id": 0, "value": "Nenhum" })
    cursoteoligico.push({ "id": 1, "value": "Basico" })
    cursoteoligico.push({ "id": 2, "value": "Medio" })
    cursoteoligico.push({ "id": 3, "value": "Bacharel" })
    cursoteoligico.push({ "id": 4, "value": "Doutorado" })

    return cursoteoligico
  }

  Funcao() {
    let funcao = [];
    funcao.push({ "id": 0, "value": "selecione" })
    funcao.push({ "id": 1, "value": "Membro" })
    funcao.push({ "id": 2, "value": "Cooperador" })
    funcao.push({ "id": 3, "value": "Diacono" })
    funcao.push({ "id": 4, "value": "Presbitero" })
    funcao.push({ "id": 5, "value": "Evangelista" })
    funcao.push({ "id": 6, "value": "Pastor" })

    return funcao
  }

  EntradaFuncao() {
    let entradaFuncao = [];
    entradaFuncao.push({ "id": 0, "value": "selecione" })
    entradaFuncao.push({ "id": 1, "value": "Apresentado" })
    entradaFuncao.push({ "id": 2, "value": "Consagrado" })
    entradaFuncao.push({ "id": 3, "value": "Recebido" })
    entradaFuncao.push({ "id": 5, "value": "Ordenado" })
    entradaFuncao.push({ "id": 4, "value": "Reintegrado" })

    return entradaFuncao
  }


  TipoRelatorio() {
    let relatorio = [];
    relatorio.push({ "id": 0, "value": "Selecione" })
    relatorio.push({ "id": 4, "value": "Aniversariantes" })
    relatorio.push({ "id": 17, "value": "Batizados" })
    relatorio.push({ "id": 3, "value": "Idosos" })
    relatorio.push({ "id": 1, "value": "Membros Ativos" })
    relatorio.push({ "id": 2, "value": "Membros Inativos" })
    relatorio.push({ "id": 5, "value": "Presença em santa Ceia" })
    relatorio.push({ "id": 6, "value": "Presença em reunião obreiros (Local)" })
    relatorio.push({ "id": 7, "value": "Presença em reunião obreiros (Sede)" })
    relatorio.push({ "id": 19, "value": "Transferência de Pastores" })

    return relatorio
  }


  Periodo() {
    let periodo = [];
    periodo.push({ "id": 0, "value": "Selecione o periodo" });
    periodo.push({ "id": 1, "value": "Semanal" });
    periodo.push({ "id": 2, "value": "Mensal" });

    return periodo;
  }

  MesesDoAno() {
    let periodo = [];
    periodo.push({ "id": 0, "value": "Informe o mês" });
    periodo.push({ "id": 1, "value": "Janeiro" });
    periodo.push({ "id": 2, "value": "Fevereiro" });
    periodo.push({ "id": 3, "value": "Março" });
    periodo.push({ "id": 4, "value": "Abril" });
    periodo.push({ "id": 5, "value": "Maio" });
    periodo.push({ "id": 6, "value": "Junho" });
    periodo.push({ "id": 7, "value": "Julho" });
    periodo.push({ "id": 8, "value": "Agosto" });
    periodo.push({ "id": 9, "value": "Setembro" });
    periodo.push({ "id": 10, "value": "Outubro" });
    periodo.push({ "id": 11, "value": "Novembro" });
    periodo.push({ "id": 12, "value": "Dezembro" });

    return periodo;
  }

  PeriodoCemAnos() {
    let periodo = [];
    periodo.push({ "id": 0, "value": "Informe o mês" });

    const anoCorrente = new Date().getFullYear();

    for (let index = 0; index < 100; index++) {
      const element = index;


    }

    periodo.push({ "id": 0, "value": "Informe o mês" });
    periodo.push({ "id": 1, "value": "Janeiro" });
    periodo.push({ "id": 2, "value": "Fevereiro" });
    periodo.push({ "id": 3, "value": "Março" });
    periodo.push({ "id": 4, "value": "Abril" });
    periodo.push({ "id": 5, "value": "Maio" });
    periodo.push({ "id": 6, "value": "Junho" });
    periodo.push({ "id": 7, "value": "Julho" });
    periodo.push({ "id": 8, "value": "Agosto" });
    periodo.push({ "id": 9, "value": "Setembro" });
    periodo.push({ "id": 10, "value": "Outubro" });
    periodo.push({ "id": 11, "value": "Novembro" });
    periodo.push({ "id": 12, "value": "Dezembro" });

    return periodo;
  }


  public TipoCartas(): any {
    let documento = [];
    documento.push({ "id": 0, "value": "Selecione" })
    documento.push({ "id": 13, "value": "Carta de Recomendação" })
    documento.push({ "id": 14, "value": "Carta de Rec.Casal" })
    documento.push({ "id": 15, "value": "Carta de Mudança" })
    documento.push({ "id": 16, "value": "Carta de Mud.Casal" })
    return documento
  }

  public JustificativaPresenca(): any {
    let presenca = [];
    presenca.push({ "id": 0, "value": "Selecione" })
    presenca.push({ "id": 3, "value": "Santa Ceia" })
    presenca.push({ "id": 1, "value": "Reuniao Obreiro Local" })
    presenca.push({ "id": 2, "value": "Reuniao Obreiro Sede" })
    return presenca
  }

  public TipoJustificativaPresenca(): any {
    let tipoPresenca = [];
    tipoPresenca.push({ "id": 3, "value": "Marcar presença" })
    tipoPresenca.push({ "id": 1, "value": "Justificar presença (Doença)" })
    tipoPresenca.push({ "id": 2, "value": "Justificar presença (Idoso)" })
    tipoPresenca.push({ "id": 4, "value": "Justificar presença (Trabalho)" })
    tipoPresenca.push({ "id": 5, "value": "Justificar presença (Viagem)" })
    tipoPresenca.push({ "id": 6, "value": "Outros" })
    return tipoPresenca
  }

  TipoUsuario() {
    let tipoUsuario = [];
    tipoUsuario.push({ "id": 0, "value": "Selecione" })
    tipoUsuario.push({ "id": 2, "value": "Secretario" })
    tipoUsuario.push({ "id": 3, "value": "Membro" })
    tipoUsuario.push({ "id": 4, "value": "Tesoureiro" })
    tipoUsuario.push({ "id": 5, "value": "DepInfantil" })

    return tipoUsuario;

  }

  SimNao() {
    let simNao = [];
    simNao.push({ "id": 0, "value": "Selecione" })
    simNao.push({ "id": 1, "value": "Sim" })
    simNao.push({ "id": 2, "value": "Não" })
    return simNao;
  }



  PopupConfirmacao(mensagem: string, tipo: number, componente: any, Id: any = 0, Width: any = 'auto', Height: any = 'auto', disableClose: boolean = false, status: boolean = false) {

    const dialog = this.dialog.open(componente, {
      id: Id,
      width: Width,
      height: Height,
      disableClose: disableClose,
      data: { mensagem: mensagem, tipo: tipo, data: componente }
    });
    return dialog.afterClosed();
  }
}
