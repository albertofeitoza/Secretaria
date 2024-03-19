import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DadosObreiro } from 'src/app/models/DadosObreiro';
import { Historico } from 'src/app/models/HistoricoDoObreiro';
import { PopupConfirm } from 'src/app/models/dialogConfirm';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-historico-popup',
  templateUrl: './historico-popup.component.html',
  styleUrls: ['./historico-popup.component.css']
})
export class HistoricoPopupComponent implements OnInit {

  historico: Historico = new Historico()
  resposta: PopupConfirm = new PopupConfirm();
  dadosObreiro : DadosObreiro = new DadosObreiro()
  entradaFuncao: any[]

  constructor(private serviceUtil : UtilServiceService,
    public dialogRef: MatDialogRef<HistoricoPopupComponent>,
    public dialog: MatDialog,

    ) {}


ngOnInit(): void {
  this.entradaFuncao = this.serviceUtil.EntradaFuncao()
}

  FecharPopup(confirm: boolean){
  
    if (confirm) {
      if (this.historico.dataEntradaFuncao && this.dadosObreiro.pastorApresentador && this.dadosObreiro.pastorRegional && this.historico.entradaFuncao) {

        let dados ={
          pastorApresentador : this.dadosObreiro.pastorApresentador,
          pastorRegional : this.dadosObreiro.pastorRegional,
          entradaFuncao : this.historico.entradaFuncao,
          dataEntradaFuncao : this.historico.dataEntradaFuncao,
          reintegrado : this.historico.reintegrado,
          reintegradoEm : this.historico.reintegradoEm,
          aprovado : this.historico.aprovado
         }
         this.resposta.Status = true;
         this.resposta.data = dados
         this.dialogRef.close(this.resposta);
      }
      else{
        this.resposta.Status = false;
        this.resposta.Motivo = "Dados inválidos, informar a data de entrada, pastor apresentador e pastor regional."
        this.resposta.data = null
        this.dialogRef.close(this.resposta);
      }
    }
    else {
      this.resposta.Status = false;
      this.dialogRef.close(this.resposta)
    }
  
  }

}
