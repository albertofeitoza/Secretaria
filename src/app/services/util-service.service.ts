import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import DateDiff from 'date-diff';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';
import { EMPTY, Observable } from 'rxjs';
import * as printJS from 'print-js';


@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(
    public overlay: Overlay,
    public dialog: MatDialog,
    private toast: ToastrService
  ) { }

  erroHandler(e: any): Observable<any> {
    let mensagem = e.error;
    this.toast.error(mensagem);
    return new Observable();
  }
  convertToBase64(data: any) {
    return btoa(data);
  }

  convertBase64toText(txt: string) {
    return atob(txt);

  }

  Imprimir(result: any, type: string) {

    try {

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

    } catch (error) {
      console.log(error)
    }
  }

  BaixarArquivo(result: any, type: string, nomeArquivo: string) {
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
    estCivil.push({ "id": 1, "value": "Solteiro(a)" })
    estCivil.push({ "id": 2, "value": "1º Casamento" })
    estCivil.push({ "id": 3, "value": "2º Casamento Viuvo(a)" })
    estCivil.push({ "id": 4, "value": "2º Casamento Divorciado(a)" })
    estCivil.push({ "id": 5, "value": "Viuvo(a)" })
    estCivil.push({ "id": 6, "value": "Separado(a)" })
    estCivil.push({ "id": 7, "value": "Divorciado(a)" })

    return estCivil
  }

  GrauInstrucao() {

    let grauInstrucao = [];

    grauInstrucao.push({ "id": 0, "value": "Selecione" })
    grauInstrucao.push({ "id": 1, "value": "Analfabeto" })
    grauInstrucao.push({ "id": 2, "value": "Ensino Fundamental" })
    grauInstrucao.push({ "id": 3, "value": "1º Grau Completo" })
    grauInstrucao.push({ "id": 4, "value": "1º Grau InCompleto" })
    grauInstrucao.push({ "id": 5, "value": "2º Grau Completo" })
    grauInstrucao.push({ "id": 6, "value": "2º Grau InCompleto" })
    grauInstrucao.push({ "id": 7, "value": "Superior Completo" })
    grauInstrucao.push({ "id": 8, "value": "Superior Incompleto" })
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

  StatusPagamento() {

    let statusPagamento = [];

    statusPagamento.push({ "id": 0, "value": "Em aberto" })
    statusPagamento.push({ "id": 1, "value": "Pago" })
    return statusPagamento
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
    funcao.push({ "id": 3, "value": "Diácono" })
    funcao.push({ "id": 4, "value": "Presbítero" })
    funcao.push({ "id": 5, "value": "Evangelista" })
    funcao.push({ "id": 6, "value": "Pastor" })

    return funcao
  }

  FuncaoTelaCadastro() {
    let funcao = [];
    funcao.push({ "id": 0, "value": "selecione" })
    funcao.push({ "id": 1, "value": "Membro" })
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


  TipoFilhos() {
    let tipoFilho = [];
    tipoFilho.push({ "id": -1, "value": "Selecione" });
    tipoFilho.push({ "id": 0, "value": "Criança" });
    tipoFilho.push({ "id": 1, "value": "Adolescente" });
    tipoFilho.push({ "id": 2, "value": "Adulto" });

    return tipoFilho;
  }

  public TipoCartas(): any {
    let documento = [];
    documento.push({ "id": 0, "value": "Selecione" })
    documento.push({ "id": 13, "value": "Carta de Recomendação" })
    documento.push({ "id": 14, "value": "Carta de Rec.Casal" })
    documento.push({ "id": 22, "value": "Carta de Mud Interna." })
    documento.push({ "id": 23, "value": "Carta de Mud Interna Casal" })
    documento.push({ "id": 15, "value": "Carta de Mud Externa" })
    documento.push({ "id": 16, "value": "Carta de Mud Externa Casal" })
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
    tipoUsuario.push({ "id": 6, "value": "DepAdolescentes" })

    return tipoUsuario;

  }

  SimNao() {
    let simNao = [];
    simNao.push({ "id": 0, "value": "Selecione" })
    simNao.push({ "id": 1, "value": "Sim" })
    simNao.push({ "id": 2, "value": "Não" })
    return simNao;
  }

  TipoIgreja() {
    let tipoIgreja = [];
    tipoIgreja.push({ "id": 0, "value": "Selecione" })
    tipoIgreja.push({ "id": 1, "value": "Sede" })
    tipoIgreja.push({ "id": 2, "value": "Subsede" })
    tipoIgreja.push({ "id": 3, "value": "Congregacao" })
    return tipoIgreja;
  }

  public TipoDocumento() {

    let documento = [];

    documento.push({ "id": -1, "value": "Selecione" })
    documento.push({ "id": 0, "value": "Foto de Perfil" })
    documento.push({ "id": 1, "value": "Cópia de RG" })
    documento.push({ "id": 2, "value": "Cópia de CPF" })
    documento.push({ "id": 3, "value": "Comprovante de Residência" })
    documento.push({ "id": 4, "value": "Cópia Certidão de Nascimento" })
    documento.push({ "id": 5, "value": "Cópia Certidão de Casamento" })
    documento.push({ "id": 6, "value": "Cópia de ATA" })
    documento.push({ "id": 7, "value": "Cópia da Carta de Mudança" })
    documento.push({ "id": 8, "value": "Cópia da Carta de Recomendação" })
    documento.push({ "id": 9, "value": "Outros" })

    return documento
  }


  Popup(mensagem: string, tipo: number, componente: any, Id: any = 0, Width: any = 'auto', Height: any = 'auto', disableClose: boolean = false, status: boolean = false, dados: any = null, motivo: boolean = true) {

    const dialog = this.dialog.open(componente, {
      id: Id,
      width: Width,
      height: Height,
      disableClose: disableClose,
      data: { mensagem: mensagem, tipo: tipo, data: componente, dadosTela: dados, motivo: motivo }
    });
    return dialog.afterClosed();
  }



  public ValidaCpf(cpfEntrada: string): boolean {

    if (cpfEntrada) {


      cpfEntrada = cpfEntrada.replace(/\D/g, '') // remove tudo que não é numero

      let numeroCpf = ("00000000000" + cpfEntrada).slice(-11);

      if (!cpf.isValid(numeroCpf)) {
        this.toast.warning("Cpf Inválido")
        return false

      } else
        return true
    }
    else
      this.toast.warning("Informe o Cpf")
    return false
  }


  public ValidaCNPJ(CnpjEntrada: string): boolean {

    if (CnpjEntrada) {

      let numeroCpf = ("00000000000000" + CnpjEntrada).slice(-14);

      if (!cnpj.isValid(numeroCpf)) {
        this.toast.warning("cnpj Inválido")
        return false

      } else
        return true
    }
    else
      this.toast.warning("Informe o CNPJ")
    return false
  }

  public SubtractYears(date: Date): number {

    var date1 = new Date;
    var date2 = new Date(date);

    var diff = new DateDiff(date1, date2);

    // diff.years(); // ===> 1.9
    // diff.months(); // ===> 23
    // diff.days(); // ===> 699
    // diff.weeks(); // ===> 99.9
    // diff.hours(); // ===> 16776
    // diff.minutes(); // ===> 1006560
    // diff.seconds(); // ===> 60393600
    return diff.years()
  }

  //To encrypt input data
  public encrypt(text: any): string {

    let key = 'password';

    return CryptoJS.AES.encrypt(text, key).toString();
  }

  public decrypt(text: any) {

    try {

      let key = 'password';


      var bytes = CryptoJS.AES.decrypt(text, key);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText

    } catch (error) {
      return error;
    }
  }
}
