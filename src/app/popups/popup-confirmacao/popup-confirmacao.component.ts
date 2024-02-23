import { Component, OnInit } from '@angular/core';
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
  resposta: PopupConfirm = new PopupConfirm();
  constructor(
    public dialogRef: MatDialogRef<PopupConfirmacaoComponent>,
    public dialog: MatDialog,
    private utilService: UtilServiceService

  ) {
  }

  ngOnInit() {
    this.mensagem = this.dialogRef._containerInstance._config.data.mensagem
  }

  FecharPopup(confirm: boolean): void {

    if (confirm) {
      if (this.resposta.Motivo) {
        this.resposta.Status = confirm;
        this.resposta.Motivo = this.resposta.Motivo
        this.dialogRef.close(this.resposta);
      }
      else
        this.utilService.showMessage("Obrigatório Informar o Motivo")
    }
    else {
      this.dialogRef.close(this.resposta)
    }

  }

}
