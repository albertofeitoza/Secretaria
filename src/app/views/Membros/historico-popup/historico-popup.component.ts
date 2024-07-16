import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { DadosObreiro } from 'src/app/models/DadosObreiro';
import { Historico } from 'src/app/models/HistoricoDoObreiro';
import { PopupConfirm } from 'src/app/models/dialogConfirm';
import { AllservicesService } from 'src/app/services/allservices.service';
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
    private serverApi: AllservicesService<any>,

    ) {}


ngOnInit(): void {
  this.entradaFuncao = this.serviceUtil.EntradaFuncao()
  if(Number(this.dialogRef.id) > 0)
    this.buscarHistorico(this.dialogRef.id);

}

  FecharPopup(confirm: boolean){
  
    if (confirm) {
      if (this.historico.dataEntradaFuncao && this.historico.pastorApresentador && this.historico.pastorRegional && this.historico.entradaFuncao && this.historico.local ) {
        this.resposta.Status = true;
         this.resposta.data = this.historico
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

  private buscarHistorico(id: any):void {
    this.serverApi.readById(id, Endpoint.HistoricoObreiro)
      .subscribe((result: Historico) => {
        this.historico = result;
      });
  }

}
