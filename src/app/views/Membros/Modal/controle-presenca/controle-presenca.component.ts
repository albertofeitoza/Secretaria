import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { ControlePresenca } from 'src/app/models/ControlePresenca';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-controle-presenca',
  templateUrl: './controle-presenca.component.html',
  styleUrls: ['./controle-presenca.component.css']
})
export class ControlePresencaComponent implements OnInit {
  dados: Pessoa = new Pessoa();
  funcao: number = 0;
  comboTipoPresenca: any[]
  tipoPresencaSelecionado: number = 0;
  controlePresenca: ControlePresenca = new ControlePresenca();
  constructor(
    private matdialogRef: MatDialogRef<ControlePresencaComponent>,
    private serviceUtil: UtilServiceService,
    private serviceApi: AllservicesService<any>
  ) {
  }

  ngOnInit(): void {
    this.BuscarPessoa();
    this.CarregaCombos()

  }

  private BuscarPessoa(): void {
    this.serviceApi.readById(this.matdialogRef.id, Endpoint.Pessoa)
      .subscribe((result) => {
        this.dados = result?.data?.pessoa;
        this.funcao = result?.data?.dadosMembro?.funcao;

      });
  }
  private CarregaCombos(): void {
    this.comboTipoPresenca = this.serviceUtil.JustificativaPresenca();
  }


  public Salvar(): void {
    this.controlePresenca.local = this.tipoPresencaSelecionado
    this.controlePresenca.pessoaId = this?.dados?.id

    if (this.tipoPresencaSelecionado === 3) {
      this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
        .subscribe(result => {
          this.serviceUtil.showMessage("Informações cadastradas com sucesso!")
        });
    }

    if (this.tipoPresencaSelecionado > 0 && this.tipoPresencaSelecionado < 3 && this.funcao > 1) {
      this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
        .subscribe(result => {
          this.serviceUtil.showMessage("Informações cadastradas com sucesso!")
        });
    } else {
      this.serviceUtil.showMessage(`O ${this.dados.nome} não é um obreiro!`);
    }
  }
}
