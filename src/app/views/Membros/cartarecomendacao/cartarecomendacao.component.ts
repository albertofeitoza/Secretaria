import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Cartas } from 'src/app/models/Cartas';
import { PopupConfirm } from 'src/app/models/dialogConfirm';
import { Pessoa, ViewPessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-cartarecomendacao',
  templateUrl: './cartarecomendacao.component.html',
  styleUrls: ['./cartarecomendacao.component.css']
})
export class CartarecomendacaoComponent implements OnInit {

  resposta: PopupConfirm = new PopupConfirm();
  dados: Pessoa = new Pessoa();
  teste: string = "ok"
  relatorioSelecionado: number = 0;
  comboCartas: any[]
  dadosSolicitacao: Cartas = new Cartas()

  constructor(private serviceUtil: UtilServiceService,
    public dialogRef: MatDialogRef<CartarecomendacaoComponent>,
    public dialog: MatDialog,
    private serviceApi: AllservicesService<any>) {

  }

  ngOnInit() {
    this.BuscarPessoa();
    this.CarregaCombos()
  }

  CarregaCombos() {
    this.comboCartas = this.serviceUtil.TipoCartas()
  }

  BuscarPessoa() {
    this.serviceApi.readById(this.dialogRef.id, Endpoint.Pessoa)
      .subscribe(p => {
        this.dados = p.data.pessoa

      })
  }

  FecharPopup(confirm: boolean) {

    if (confirm) {

      if (this.relatorioSelecionado == 13) {

        this.resposta.Status = true;
        this.dadosSolicitacao.idPessoa = Number(this.dialogRef.id);
        this.dadosSolicitacao.tipoRelatorio = this.relatorioSelecionado;
        this.resposta.data = this.dadosSolicitacao
        this.dialogRef.close(this.resposta);
      }
      if (this.relatorioSelecionado == 14 && this.dados.estadoCivil == 1) {
        this.serviceUtil.showMessage("Uma pessoa solteiro(a) não pode emitir uma carta de recomendação de casal", true)
      }
      else {
        this.resposta.Status = true;
        this.dadosSolicitacao.idPessoa = Number(this.dialogRef.id);
        this.dadosSolicitacao.tipoRelatorio = this.relatorioSelecionado;
        this.resposta.data = this.dadosSolicitacao
        this.dialogRef.close(this.resposta);
      }
    }
    else {
      this.resposta.Status = false;
      this.dialogRef.close(this.resposta)
    }

  }




}