import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AllservicesService } from 'src/app/services/allservices.service';
import { ViewFilhos } from '../../model/viewFilhos';
import { ToastrService } from 'ngx-toastr';

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
    private toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.dadosTela = this.dialofRef._containerInstance._config.data.dadosTela;
    this.nomepai = this.dadosTela?.nomePai ? this.dadosTela?.nomePai : undefined;
    this.nomemae = this.dadosTela?.nomeMae ? this.dadosTela?.nomeMae : undefined;
  }



  public Cancelar(): void {
    this.dialofRef.close(false);
  }

  public Selecionar(): void {

    if (!this.nomeLider){
      this.toast.warning("Informar o Nome do lider do departamento infantil")
      return;
    }
       

    if (!this.nomepai){
      this.toast.warning("Informar o Nome do pai.")
      return;
    }
      

    if (!this.nomemae){
      this.toast.warning("Informar o Nome da mãe.")
      return
    }
      

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
