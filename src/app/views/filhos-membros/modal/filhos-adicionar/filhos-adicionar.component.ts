import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { DtoFilhos, ViewFilhos } from '../../model/viewFilhos';

@Component({
  selector: 'app-filhos-adicionar',
  templateUrl: './filhos-adicionar.component.html',
  styleUrls: ['./filhos-adicionar.component.css']
})
export class FilhosAdicionarComponent implements OnInit {

  igrejaSelecionada = 0;
  idCrianca = 0
  filho: DtoFilhos = new DtoFilhos();
  simNao: any[];
  filhoMembro: number = 0;

  ListaPai: any[] = new Array();
  ListaMae: any[] = new Array();
  tipoFilhos: any[] = new Array();


  constructor(
    private dialogRef: MatDialogRef<FilhosAdicionarComponent>,
    private servico: UtilServiceService,
    private serviceApi: AllservicesService<any>
  ) { }

  ngOnInit(): void {
    this.igrejaSelecionada = this.dialogRef._containerInstance._config.data.dadosTela.idIgreja;
    this.idCrianca = this.dialogRef._containerInstance._config.data.dadosTela.idCrianca;
    this.CarregaCombos();
    this.BuscarFilho(this.idCrianca)


  }

  private BuscarFilho(idCrianca: number): void {

    if (idCrianca === 0)
      return;

    this.serviceApi.readById(idCrianca.toString(), Endpoint.Filhos)
      .subscribe((result: DtoFilhos) => {

        this.filho = result;
        this.filhoMembro = result.membro ? 1 : 2;
      })
  }

  private CarregaCombos(): void {
    this.simNao = this.servico.SimNao()
    this.CarregarComboPaiMae()
    this.tipoFilhos = this.servico.TipoFilhos();
  }
  private CarregarComboPaiMae(): void {

    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.igrejaSelecionada}`)
      .subscribe((result: Pessoa[]) => {

        this.ListaPai = result.filter(p => p.sexo === 1);
        this.ListaMae = result.filter(p => p.sexo === 2);

      });
  }

  public Filtros(event: any): void {

  }

  public Salvar(): void {

    if (this.filho.nome && this.filho.dataNascimento && this.filhoMembro > 0) {


      this.filho.igrejaId = this.igrejaSelecionada;
      this.filho.membro = this.filhoMembro == 1 ? true : false

      this.serviceApi.create(this.filho, Endpoint.Filhos)
        .subscribe(x => {
          this.servico.showMessage(`${this.filho.id == undefined ? 'Cadastro realizado com sucesso!' : 'Dados atualizados.'} `, false)
          this.CarregarComboPaiMae();

          if (this.filho.id > 0)
            this.dialogRef.close();
          else
            this.filho = new DtoFilhos();

        });

    } else {
      this.servico.showMessage('Obrigatório os campos, Nome, Data de Nascimento e se é Membro e o tipo de filho', false)
    }
  }

  public FecharPopup(): void {
    this.dialogRef.close();
  }

}
