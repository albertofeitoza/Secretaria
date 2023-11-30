import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirmacao',
  templateUrl: './popup-confirmacao.component.html',
  styleUrls: ['./popup-confirmacao.component.css']
})
export class PopupConfirmacaoComponent implements OnInit {

  mensagem: string = ""

  constructor(
    public dialogRef: MatDialogRef<PopupConfirmacaoComponent>,
    public dialog: MatDialog

  ) {
  }

  ngOnInit() {
    this.mensagem = this.dialogRef._containerInstance._config.data.mensagem
  }

  FecharPopup(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }

}
