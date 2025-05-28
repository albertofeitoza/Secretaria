import { Component, Injectable, OnInit } from '@angular/core';
import { _MatTableDataSource } from '@angular/material/table';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { ViewPessoa } from 'src/app/models/pessoa';
import { ServiceCenter } from 'src/app/models/ServiceCenter';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { PendenciasComponent } from './modal/pendencias/pendencias.component';
import { PessoasporfuncaoComponent } from './modal/pessoasporfuncao/pessoasporfuncao.component';
import { TodasAsIgrejas } from 'src/app/models/Igreja';
import Chart from 'chart.js/auto';


@Injectable()

@Component({
  selector: 'app-service-center',
  templateUrl: './service-center.component.html',
  styleUrls: ['./service-center.component.css']
})
export class ServiceCenterComponent implements OnInit {

  tipoUsuario: Number = 0;

  servicecenter: ServiceCenter[] = new Array();
  departamentos: any = new Array();
  funcoes: any = new Array();
  totalGeralMembros = 0;
  pessoas: ViewPessoa[] = new Array();
  igrejasDoCampo: TodasAsIgrejas[] = new Array();
  chart: any = [];

  constructor(
    private auth: AutenticacaoService,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService
  ) { }

  ngOnInit() {
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.BuscarMembros();
    this.BuscarPendencias();
    this.CriarChart();
  }
  CriarChart() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['Membros', 'Cooperadores', 'Diáconos', 'Presbíteros', 'Evangelistas', 'Pastores'],
        datasets: [
          {
            // label: '# of values',
            data: [541,2,3,4,5,6
            //   {
            //   value: 541
            // }, {
            //   value: 22
            // }, {
            //   value: 12
            // }, {
            //   value: 8
            // }, {
            //   value: 6
            // }, {
            //   value: 3
            // }
          ],
            borderWidth: 1,

          },
        ],
      },
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;

            this.chart.data.datasets[0].label =
              index === 0 ? 'Membros' :
                index === 1 ? 'Cooperadores' :
                  index === 2 ? 'Diáconos' :
                    index === 3 ? 'Presbíteros' :
                      index === 4 ? 'Evangelistas' :
                        index === 4 ? 'Pastores' : '';



            // alert(`Você clicou no ponto com índice ${index} e valor ${this.chart.data.datasets[0].data[index]}`);
          }
        },

        scales: {
          y: {
            beginAtZero: true,
          },
        },
        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        plugins: {
          subtitle: {
            display: true,
            text: 'MEMBROS'
          }
        }
      },
    });
  }


  private BuscarMembros(): void {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? 0 : this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ViewPessoa[]) => {
        this.pessoas = result;
        this.funcoes = new Set(result.map(x => x.funcao).sort());
        this.totalGeralMembros = result.filter(x => x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro").length;
      });
  }

  private BuscarPendencias(): void {
    this.serviceApi.read(Endpoint.ServiceCenter + `/estabelecimento/${this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? 0 : this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ServiceCenter[]) => {

        this.departamentos = new Set(result.map(x => x.departamento).sort());
        this.servicecenter = result;
      });
  }

  public QuantPendencias(departamento: any): number {
    return this.servicecenter.filter(x => x.departamento.includes(departamento)).length;
  }

  public ExibirPependencia(departamento: any): void {
    const dados = this.servicecenter.filter(x => x.departamento.includes(departamento));
    if (dados)
      this.serviceUtil.Popup(departamento, TipoPopup.ComponenteInstancia, PendenciasComponent, 0, 'auto', 'auto', false, false, dados)
  }

  public ExibirPessoas(funcao: string): void {
    const dados = this.pessoas.filter(x => x.funcao.includes(funcao) && x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro");
    if (dados)
      this.serviceUtil.Popup(funcao, TipoPopup.ComponenteInstancia, PessoasporfuncaoComponent, 0, 'auto', 'auto', false, false, dados)

  }

  public QuantPessoas(funcao: any): number {
    return this.pessoas.filter(x => x.funcao.includes(funcao) && x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro").length;
  }
}
