import { Component, OnInit } from '@angular/core';
import { FinanceiroDto } from '../../model/financeiroDto';
import { MatDialogRef } from '@angular/material/dialog';
import { AllservicesService } from 'src/app/services/allservices.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { TipoPopup } from 'src/app/enum/TipoPopup';

@Component({
  selector: 'app-financeiro-cadastro-boleto',
  templateUrl: './financeiro-cadastro-boleto.component.html',
  styleUrls: ['./financeiro-cadastro-boleto.component.css']
})
export class FinanceiroCadastroBoletoComponent implements OnInit {

  boleto: FinanceiroDto = new FinanceiroDto();
  idBoleto = 0;
  idAssinatura = 0;
  statusPagamento: any;


  constructor(
    private dialogRef: MatDialogRef<FinanceiroCadastroBoletoComponent>,
    private serverApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService
  ) { }

  ngOnInit(): void {
    this.idBoleto = this.dialogRef._containerInstance._config.data.tipo === TipoPopup.edicaoDados ? this.dialogRef._containerInstance._config.data.dadosTela.id : 0;
    this.idAssinatura = this.dialogRef._containerInstance._config.data.tipo === TipoPopup.cadastro ? this.dialogRef._containerInstance._config.data.dadosTela.id : 0;

    this.CarregarBoleto();
    this.CarregarCombos();

  }

  private CarregarCombos(): void {
    this.statusPagamento = this.serviceUtil.StatusPagamento();
  }

  private CarregarBoleto(): void {

    if (this.idBoleto > 0) {
      this.serverApi.readById(this.idBoleto.toString(), Endpoint.Financeiro)
        .subscribe((result: FinanceiroDto) => {
          this.boleto = result;
        });
    }
  }


  public Salvar(): void {

    this.boleto.assinaturaId = this.idBoleto === 0 ? this.idAssinatura : this.boleto.assinaturaId
    this.serverApi.create(this.boleto, Endpoint.Financeiro)
      .subscribe(() => {
        this.dialogRef.close(); 
      });
  }

}
