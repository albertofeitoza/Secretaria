import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Pastor } from 'src/app/models/Pastor';
import { Pessoa } from 'src/app/models/pessoa';
import { RelatorioPastores } from 'src/app/models/relatorios';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-pastores',
  templateUrl: './pastores.component.html',
  styleUrls: ['./pastores.component.css']
})
export class PastoresComponent implements OnInit {

  ColunasGridPastores = ['pastor', 'datainicial', 'membrosinicial', 'membrossaida', 'saldomembros', 'status']
  datasource: RelatorioPastores[] = new Array()
  mensagemDeretorno = "";
  spinner = false;
  pessoa: Pessoa = new Pessoa();
  pastor: Pastor = new Pastor()
  instrucao: any[];
  sexo: any[];

  constructor(
    private utilService: UtilServiceService,
    private matdialogRef: MatDialogRef<PastoresComponent>,
    private serverApi: AllservicesService<any>,
  ) {

  }
  ngOnInit(): void {
    this.BuscarPastores()
    this.CarregarCombos();
  }

  private BuscarPastores(): void {

    this.spinner = true;

    this.serverApi.read(Endpoint.Pastores + `/estabelecimento/${this.matdialogRef.id}`)
      .subscribe(result => {

        this.datasource = new Array();

        result.forEach((x) => {

          let pastor: RelatorioPastores = new RelatorioPastores();
          pastor.pastor = x.pessoa.nome;
          pastor.esposa = x.pessoa.nomeConjuge;
          pastor.datainicial = x.dataEntrada;
          pastor.membrosinicial = x.qantidadeMembosEntrada;
          pastor.membrossaida = x.qantidadeMembosSaida;
          pastor.saldomembros = x.diferencaMembrosSaida;
          pastor.status = x.ativo;

          this.datasource.push(pastor);

        });
        this.spinner = false;
      });
  }

  public CadastroPastor(): void {

    this.pessoa.estadoCivil = 1;
    this.pessoa.statusPessoa = 0;

    this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', Number(this.matdialogRef.id)).subscribe(response => {
      if (response.code != 200) {
        this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
        this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
        this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
        this.pessoa.igrejaId = Number(this.matdialogRef.id)
        this.serverApi.create(this.pessoa, Endpoint.Pessoa).subscribe(result => {
          this.pessoa = result
          this.CadastrarPastor(result, true);
        });
      } else {
        this.CadastrarPastor(response, false);
      }
    });

  }


  private CadastrarPastor(pessoa: any, acao: boolean): void {

    this.pastor.id = 0;
    this.pastor.pessoaId = pessoa.data.id;
    this.pastor.igrejaId = Number(this.matdialogRef.id);
    this.pastor.dataEntrada = new Date;
    this.pastor.qantidadeMembosEntrada = this.pastor.qantidadeMembosEntrada;
    this.pastor.qantidadeMembosSaida = 0;
    this.pastor.diferencaMembrosSaida = 0;
    this.pastor.ativo = true;

    this.serverApi.create(this.pastor, Endpoint.Pastores)
      .subscribe(() => {
        this.utilService.showMessage("Cadastro realizado com sucesso");
        this.BuscarPastores();
      });

  }



  private CarregarCombos(): void {
    this.instrucao = this.utilService.GrauInstrucao();
    this.sexo = this.utilService.Sexo();
  }


}