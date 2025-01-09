import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ViewFilhos } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-modal-seleciona-lider',
  templateUrl: './modal-seleciona-lider.component.html',
  styleUrls: ['./modal-seleciona-lider.component.css']
})
export class ModalSelecionaLiderComponent implements OnInit {

  dadosTela: any;
  comboTipoRelatorio: any;
  tipoRelatorioSelecionado = 0;
  nomeLider: any = undefined;
  nomepai: any = undefined;
  nomemae: any = undefined;

  dadosFilho: ViewFilhos = new ViewFilhos();

  constructor(
    private dialofRef: MatDialogRef<ModalSelecionaLiderComponent>,
    private servico: UtilServiceService,
    private serviceApi: AllservicesService<any>
  ) {
  }

  ngOnInit(): void {
    this.dadosTela = this.dialofRef._containerInstance._config.data.dadosTela;
    this.nomepai = this.dadosTela.idPai;
    this.nomemae = this.dadosTela.idMae;
  }



  public Cancelar(): void {
    this.dialofRef.close(false);
  }

  public Selecionar(): void {

    if (!this.nomeLider)
      return this.servico.showMessage("Informar o Nome do lider do departamento infantil", true)

    if (!this.nomepai)
      return this.servico.showMessage("Informar o Nome do pai.", true)

    if (!this.nomemae)
      return this.servico.showMessage("Informar o Nome da mãe.", true)

    if (this.nomeLider && this.nomepai && this.nomemae) {

      const dados = {
        status: true,
        NomeLider: this.nomeLider,
        NomePai: this.nomepai,
        NomeMae: this.nomemae
      }

      this.dialofRef.close(dados);

    }
  }
}
