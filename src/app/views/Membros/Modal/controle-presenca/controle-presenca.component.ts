import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
  exibiroutros = false;
  tipoPresencaSelecionado: number = 0;
  controlePresenca: ControlePresenca = new ControlePresenca();

  tipoJustificativaPresenca: any[];
  justificativaSelecionada = 0;
  constructor(
    private matdialogRef: MatDialogRef<ControlePresencaComponent>,
    private serviceUtil: UtilServiceService,
    private serviceApi: AllservicesService<any>,
    private toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.funcao = this.matdialogRef._containerInstance._config.data.dadosTela.includes('Membro') ? 1 : 2;
    this.BuscarPessoa();
    this.CarregaCombos()

  }

  private BuscarPessoa(): void {
    this.serviceApi.readById(this.matdialogRef.id, Endpoint.Pessoa)
      .subscribe((result) => {
        this.dados = result
      });
  }
  private CarregaCombos(): void {
    this.comboTipoPresenca = this.serviceUtil.JustificativaPresenca();
    this.tipoJustificativaPresenca = this.serviceUtil.TipoJustificativaPresenca();
  }


  public Salvar(): void {
    this.controlePresenca.local = this.tipoPresencaSelecionado
    this.controlePresenca.pessoaId = this?.dados?.id

    // Justificar presença de santaCeia
    if (this.tipoPresencaSelecionado === 3) {


      if (this.justificativaSelecionada == 3) {
        this.controlePresenca.motivo = ''
        this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
          .subscribe(result => {
            return this.toast.success("Informações cadastradas com sucesso!")
          });
      }

      if (this.justificativaSelecionada == 6) {

        if (this.controlePresenca.motivo) {
          this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
            .subscribe(result => {
              this.toast.success("Informações cadastradas com sucesso!")
            });
        } else {
          this.toast.warning("Obrigatório informar o motivo!.")
        }
      }

      if (this.justificativaSelecionada != 6 && this.justificativaSelecionada != 3) {

        this.controlePresenca.motivo = this.ObterDescricaoJustificativa();

        this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
          .subscribe(result => {
            this.toast.success("Informações cadastradas com sucesso!")
          });
      }
    }
    // Justificar presença de obreiros
    if (this.tipoPresencaSelecionado > 0 && this.tipoPresencaSelecionado < 3) {

      if (this.funcao > 1) {
        if (this.justificativaSelecionada == 3) {
          this.controlePresenca.motivo = ''
          this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
            .subscribe(result => {
              return this.toast.success("Informações cadastradas com sucesso!")
            });
        }

        if (this.justificativaSelecionada == 6 && this.controlePresenca.motivo) {

          if (this.controlePresenca.motivo) {
            this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
              .subscribe(result => {
                return this.toast.success("Informações cadastradas com sucesso!")
              });
          } else {
            this.toast.warning("Obrigatório informar o motivo!.")
          }
        }

        if (this.justificativaSelecionada != 6 && this.justificativaSelecionada != 3) {

          this.controlePresenca.motivo = this.ObterDescricaoJustificativa();

          this.serviceApi.create(this.controlePresenca, `${Endpoint.Pessoa}/controlePresenca`)
            .subscribe(result => {
              this.toast.success("Informações cadastradas com sucesso!")
            });
        }
      } else {
        this.toast.warning("Não é um obreiro!")
      }
    }
  }

  public TipoJustificativa() {

    if (this.justificativaSelecionada === 6) {
      this.exibiroutros = true;
    } else {
      this.exibiroutros = false;
      this.controlePresenca.motivo = '';
    }
  }

  private ObterDescricaoJustificativa(): string {
    return this.tipoJustificativaPresenca.filter(x => x.id == this.justificativaSelecionada).map(v => v.value).toString();
  }
}
