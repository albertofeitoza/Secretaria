import { Component, OnInit } from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupConfirm } from 'src/app/models/dialogConfirm';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-popup-confirmacao',
  templateUrl: './popup-confirmacao.component.html',
  styleUrls: ['./popup-confirmacao.component.css']
})
export class PopupConfirmacaoComponent implements OnInit {

  mensagem: string = ""
  semMotivo = false;
  resposta: PopupConfirm = new PopupConfirm();
  constructor(
    public dialogRef: MatDialogRef<PopupConfirmacaoComponent>,
    public dialog: MatDialog,
    private utilService: UtilServiceService

  ) {
  }

  ngOnInit() {
    this.mensagem = this.dialogRef._containerInstance._config.data.mensagem
    this.semMotivo = this.dialogRef._containerInstance._config.data.motivo ? true : false;
  }

  FecharPopup(confirm: boolean): void {

    if (confirm) {

      if (!this.semMotivo) {
        this.dialogRef.close(true);
        this.resposta.Status = confirm;
        this.dialogRef.close(this.resposta);
      } else {
        this.resposta.Motivo = !this.semMotivo ? 'Sem Motivo' : this.resposta.Motivo;

        if (this.resposta.Motivo) {
          this.resposta.Status = confirm;
          this.resposta.Motivo = this.resposta.Motivo
          this.dialogRef.close(this.resposta);
        }
        else
          this.utilService.showMessage("Obrigatório Informar o Motivo")
      }

    }
    else {
      this.dialogRef.close(false)
    }

  }

}
