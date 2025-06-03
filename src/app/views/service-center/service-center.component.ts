import { Component, Injectable, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';



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

  @ViewChild('myChart', { static: false }) myChartRef!: ElementRef;

  constructor(
    private auth: AutenticacaoService,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService
  ) { }

  ngOnInit() {
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    if (this.tipoUsuario === 1 || this.tipoUsuario === 2) {
      this.BuscarMembros();
      this.BuscarPendencias();
    }

  }

  public CriarChartMembresia(dados: any) {

    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('historicoIgreja')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    let self = this;

    option = {
      title: {
        text: 'Histórico da Igreja',
        subtext: 'Membresia'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['T. Geral', 'Membros', 'Cooperador', 'Diáconos', 'Presbíteros.', 'Evangelistas', 'Pastores']
      },
      yAxis: {
        type: 'value',
        triggerEvent: true
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Todos',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside'
          },
          data: dados,
        }
      ]
    };

    option && myChart.setOption(option);

    myChart.on('click', function (params) {

      if (params.dataIndex == 0)
        self.ExibirPessoas('Todos');

      if (params.dataIndex == 1)
        self.ExibirPessoas('Membro');

      if (params.dataIndex == 2)
        self.ExibirPessoas('Cooperador');

      if (params.dataIndex == 3)
        self.ExibirPessoas('Diacono');

      if (params.dataIndex == 4)
        self.ExibirPessoas('Presbitero');

      if (params.dataIndex == 5)
        self.ExibirPessoas('Evangelista');

      if (params.dataIndex == 6)
        self.ExibirPessoas('Pastor');
    });
  }

  public CriarChartPendenciasSistema(dados: any) {

    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('historicoPendencias')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    let self = this;

    option = {
      title: {
        text: 'Pendências do Sistema',
        subtext: 'Para esses casos necessita de uma ação do secretário.'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        }
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['T. Geral', 'Pré. Cad', 'D. Pessoais', 'Inf. Membro', 'Cart. Membro.', 'Pend.Obreiro']
      },
      yAxis: {
        type: 'value',
        triggerEvent: true
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Todos',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside'
          },
          data: dados,
        }
      ]
    };

    option && myChart.setOption(option);

    myChart.on('click', function (params) {

      if (params.dataIndex == 0)
        self.ExibirPependencia('Todos');

      if (params.dataIndex == 1)
        self.ExibirPependencia('PreCadastro');

      if (params.dataIndex == 2)
        self.ExibirPependencia('DadosPessoais');

      if (params.dataIndex == 3)
        self.ExibirPependencia('DadosMembro');

      if (params.dataIndex == 4)
        self.ExibirPependencia('CartaoMembro');

      if (params.dataIndex == 5)
        self.ExibirPependencia('PendenciaObreiro');
    });
  }


  private BuscarMembros(): void {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.TipoUsuarioLogado === 1 ? 0 : this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ViewPessoa[]) => {
        this.pessoas = result;
        let dados: number[] = [];

        let totalGeralMembros = result.filter(x => x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro").length;
        let totalMembros = result.filter(x => x.funcao.toLowerCase().includes('membro') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length
        let totalCooperadores = result.filter(x => x.funcao.toLowerCase().includes('cooperador') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length
        let totalDiaconos = result.filter(x => x.funcao.toLowerCase().includes('diacono') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length
        let totalPresbiteros = result.filter(x => x.funcao.toLowerCase().includes('presbitero') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length
        let totalEvangelistas = result.filter(x => x.funcao.toLowerCase().includes('evangelista') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length
        let totalPastores = result.filter(x => x.funcao.toLowerCase().includes('pastor') && x.statusPessoa.toLocaleLowerCase() != "precadastro" && x.statusPessoa.toLocaleLowerCase() != "inativo").length

        dados.push(totalGeralMembros)
        dados.push(totalMembros)
        dados.push(totalCooperadores)
        dados.push(totalDiaconos)
        dados.push(totalPresbiteros)
        dados.push(totalEvangelistas)
        dados.push(totalPastores)
        this.CriarChartMembresia(dados);

      });
  }

  private BuscarPendencias(): void {
    this.serviceApi.read(Endpoint.ServiceCenter + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ServiceCenter[]) => {
        this.servicecenter = result;
        let dados: number[] = [];

        let totalGPendencias = result.length;
        let totalPrecadastro = result.filter(x => x.departamento.toLocaleLowerCase().includes("precadastro")).length
        let dadosPessoais = result.filter(x => x.departamento.toLocaleLowerCase().includes("dadospessoais")).length
        let dadosMembro = result.filter(x => x.departamento.toLocaleLowerCase().includes("dadosmembro")).length
        let cartaoMembro = result.filter(x => x.departamento.toLocaleLowerCase().includes("cartaomembro")).length
        let pendenciaAprovObreiro = result.filter(x => x.departamento.toLocaleLowerCase().includes("pendenciaobreiro")).length

        dados.push(totalGPendencias)
        dados.push(totalPrecadastro)
        dados.push(dadosPessoais)
        dados.push(dadosMembro)
        dados.push(cartaoMembro)
        dados.push(pendenciaAprovObreiro)

        this.CriarChartPendenciasSistema(dados);

      });
  }

  public ExibirPependencia(departamento: any): void {
    const dados = this.servicecenter.filter(x => departamento.includes("Todos") ? this.servicecenter : x.departamento.includes(departamento));
    if (dados)
      this.serviceUtil.Popup(departamento, TipoPopup.ComponenteInstancia, PendenciasComponent, 0, 'auto', 'auto', false, false, dados)
  }

  public ExibirPessoas(funcao: string) {
    const dados = this.pessoas.filter(x => funcao.includes('Todos') ? x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro" : x.funcao.includes(funcao) && x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro");
    if (dados)
      this.serviceUtil.Popup(funcao, TipoPopup.ComponenteInstancia, PessoasporfuncaoComponent, 0, 'auto', 'auto', false, false, dados)

  }
}
