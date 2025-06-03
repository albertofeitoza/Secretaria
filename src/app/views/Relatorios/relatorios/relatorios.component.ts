import {
  OnInit,
  Component,
  HostListener,
  Injectable,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Filtros } from 'src/app/models/Filtros';
import { ViewPessoa } from 'src/app/models/pessoa';
import { RelatorioAnivCasamento, RelatorioIdosos, RelatorioMembrosAtivos, ViewPastores, RelatorioPresenca } from 'src/app/models/relatorios';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class RelatoriosComponent implements OnInit {

  TituloRelatorio: string = "Relatórios"
  imprimir: boolean = false
  tipoRelatorio: any[]
  periodo: any[];
  meses: any[];
  anos: any[];
  obreiros: ViewPessoa[];
  membros: ViewPessoa[];
  relatorioSelecionado: number = 0;
  nomeRelatorio: string = "";

  filtros: Filtros = new Filtros();
  exibePeriodo = false;
  exibeMes = false;
  exibeAno = false
  exibePeriodoOutros = false;
  exibeComboObreiro = false;
  exibeComboMembros = false;


  relatorioAniversario: RelatorioAnivCasamento[] = new Array();
  relatorioAniCasamento: RelatorioAnivCasamento[] = new Array();
  relatorioMembrosAtivos: RelatorioMembrosAtivos[] = new Array()
  relatorioPastores: ViewPastores[] = new Array()

  relatorioIdosos: RelatorioIdosos[] = new Array()
  relatorioPresenca: RelatorioPresenca[] = new Array()
  spinner: boolean = false
  mensagemDeretorno = '';

  Colunas = ['nome', 'dataNascimento', 'dataAniversario']
  ColunasGridCasamento = ['nome', 'nomeConjuge', 'dataCasamento', 'quantidadeAnosCasado']
  ColunasGridMembrosAtivos = ['nome', 'rol', 'congregacao', 'validadeCartaoMembro']
  ColunasGridBatizados = ['nome', 'rol', 'congregacao', 'dataBatismo']
  ColunasGridRelatorioIdosos = ['nome', 'endereco', 'ultimaSantaCeia']
  ColunasGridRelatorioCeia = ['nome', 'janeiro', 'fevereiro', 'marco'
    , 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 'participacao']

  ColunasGridPastores = ['igreja', 'pastor', 'esposa', 'datainicial', 'membrosinicial', 'membrossaida', 'saldomembros', 'status']

  totalAniversariantes: number = 0
  totalAniversariantesCasamento: number = 0

  constructor(private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private auth: AutenticacaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.carregaCombos();
  }
  carregaCombos() {
    this.tipoRelatorio = this.serviceUtil.TipoRelatorio();
    this.periodo = this.serviceUtil.Periodo();
    this.meses = this.serviceUtil.MesesDoAno();
    this.meses = this.serviceUtil.MesesDoAno();
    this.serverApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.IgrejaSelecionada > 0 ? this.auth.dadosUsuario.IgrejaSelecionada : this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((pe: ViewPessoa[]) => {
        if (pe && pe.length > 0) {
          this.membros = pe.filter(x => x.statusPessoa != 'Inativo');
          this.obreiros = pe.filter(x => x.statusPessoa != 'Inativo' && x.funcao != 'Membro')
        }
      });
  }

  @HostListener("window:beforeprint", ["$event"])
  onBeforePrint() {
    console.log("onBeforePrint");
  }


  public RelatorioSelecionado(): void {

    this.LimparFiltros();

    switch (this.relatorioSelecionado) {
      case 1:
      case 2:
      case 3:
        this.exibePeriodo = false;
        break;
      case 4:
        this.exibePeriodoOutros = true;
        break;
      case 5:
        this.anos = []
        this.CarregaComboAnos();
        this.exibeAno = true;
        this.exibeComboMembros = true;
        this.exibeComboObreiro = false;

        break;
      case 6:
      case 7:
        this.anos = []
        this.CarregaComboAnos();
        this.exibeAno = true;
        this.exibeComboObreiro = true;
        this.exibeComboMembros = false;
        break;
      case 17:
        this.anos = []
        this.CarregaComboAnos();
        this.exibeAno = true
        break;

      case 19:

        break;
      case 20:
        //Histórico do Membro apenas download
        break;
      default:
        break;
    }
  }

  private LimparFiltros(): void {

    this.relatorioMembrosAtivos = new Array();
    this.relatorioIdosos = new Array();
    this.relatorioAniversario = new Array();
    this.relatorioAniCasamento = new Array();
    this.relatorioPresenca = new Array();
    this.exibePeriodo = false;
    this.exibePeriodoOutros = false;
    this.exibeComboObreiro = false
    this.exibeComboMembros = false;
    this.exibeMes = false;
    this.exibeAno = false;
    this.filtros.mesSelecionado = 0;
    this.filtros.pessoaId = 0;
    this.filtros.igrejaId = 0;
    this.imprimir = false;

  }

  public SelecionarPeriodo(): void {
    this.imprimir = false;
    this.exibeMes = this.filtros.periodoSelecionado > 1 ? true : false;
  }

  public SelecionaMes(): void {
    this.imprimir = false;
  }

  public SelecionaAno(): void {
    this.imprimir = false;
  }

  private CarregaComboAnos(): void {
    this.serverApi.read(Endpoint.Relatorios + '/comboCeia')
      .subscribe(result => {
        this.anos = result;
      })
  }

  public BuscarRelatorio(): void {
    try {
      this.imprimir = false;
      this.exibePeriodo = false;
      this.mensagemDeretorno = '';
      this.filtros.igrejaId = this.auth.dadosUsuario.IgrejaSelecionada > 0 ? this.auth.dadosUsuario.IgrejaSelecionada : this.auth.dadosUsuario.IgrejaLogada

      if (this.ValidacoesRelatorio()) {
        this.spinner = true
      } else {
        return;
      }

      this.serverApi.readById(this.relatorioSelecionado.toString(), Endpoint.Relatorios, JSON.stringify(this.filtros))
        .subscribe(rel => {

          let trataCamposPresenca: RelatorioPresenca[] = new Array()

          if (this.relatorioSelecionado === 5 || this.relatorioSelecionado === 6 || this.relatorioSelecionado === 7) {

            trataCamposPresenca = rel.data

            trataCamposPresenca.forEach(element => {
              element.janeiro = element.janeiro && element.janeiro.includes('P') ? "done" : element.janeiro && element.janeiro.includes('J') ? 'J' : 'highlight_off';
              element.fevereiro = element.fevereiro && element.fevereiro.includes('P') ? "done" : element.fevereiro && element.fevereiro.includes('J') ? 'J' : 'highlight_off';
              element.marco = element.marco && element.marco.includes('P') ? "done" : element.marco && element.marco.includes('J') ? 'J' : 'highlight_off';
              element.abril = element.abril && element.abril.includes('P') ? "done" : element.abril && element.abril.includes('J') ? 'J' : 'highlight_off';
              element.maio = element.maio && element.maio.includes('P') ? "done" : element.maio && element.maio.includes('J') ? 'J' : 'highlight_off';
              element.junho = element.junho && element.junho.includes('P') ? "done" : element.junho && element.junho.includes('J') ? 'J' : 'highlight_off';
              element.julho = element.julho && element.julho.includes('P') ? "done" : element.julho && element.julho.includes('J') ? 'J' : 'highlight_off';
              element.agosto = element.agosto && element.agosto.includes('P') ? "done" : element.agosto && element.agosto.includes('J') ? 'J' : 'highlight_off';
              element.setembro = element.setembro && element.setembro.includes('P') ? "done" : element.setembro && element.setembro.includes('J') ? 'J' : 'highlight_off';
              element.outubro = element.outubro && element.outubro.includes('P') ? "done" : element.outubro && element.outubro.includes('J') ? 'J' : 'highlight_off';
              element.novembro = element.novembro && element.novembro.includes('P') ? "done" : element.novembro && element.novembro.includes('J') ? 'J' : 'highlight_off';
              element.dezembro = element.dezembro && element.dezembro.includes('P') ? "done" : element.dezembro && element.dezembro.includes('J') ? 'J' : 'highlight_off';
            });
          }
          switch (this.relatorioSelecionado) {
            case 1:
            case 2:
            case 17:
              this.relatorioMembrosAtivos = rel.data
              this.imprimir = this.relatorioMembrosAtivos.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioMembrosAtivos.length == 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break;
            case 3:
              this.relatorioIdosos = rel.data;
              this.imprimir = this.relatorioIdosos.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioIdosos.length == 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break;
            case 4:
              let response: RelatorioAnivCasamento[] = new Array()
              response = rel.data;
              this.relatorioAniversario = response.filter(x => x.tipoRelatorio == 4)
              this.relatorioAniCasamento = response.filter(x => x.tipoRelatorio == 8)
              this.totalAniversariantes = this.relatorioAniversario.length;
              this.totalAniversariantesCasamento = this.relatorioAniCasamento.length
              this.imprimir = true;
              this.spinner = false
              this.mensagemDeretorno = this.relatorioAniversario.length === 0 && this.relatorioAniCasamento.length === 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break;
            case 5:
              this.nomeRelatorio = "Relatório - Membros / Participação na Santa Ceia. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = this.relatorioPresenca.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break

            case 6:
              this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião Local. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = this.relatorioPresenca.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break
            case 7:
              this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião na Sede. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = this.relatorioPresenca.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';
              break;
            case 19:
              this.nomeRelatorio = "Relatório - Transferência de pastores"
              this.relatorioPastores = rel.data
              this.imprimir = this.relatorioPastores.length > 0 ? true : false;
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPastores.length === 0 ? 'Não foram encontrado resultados para essa Pesquisa.' : '';

              break;
          }
        }, (err) => {
          this.toast.error(`Erro ao extrair relatório : ${err.error.message}`);
          this.spinner = false
        });
    } catch (error) {
      this.spinner = false
    }
  }

  private ValidacoesRelatorio(): boolean {

    if (this.relatorioSelecionado === 0) {
      this.toast.warning("Selecione um relatório");
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }

    if (this.relatorioSelecionado === 4 && this.filtros.periodoSelecionado === 0) {
      this.toast.warning("Selecione o período.");
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }

    if (this.relatorioSelecionado === 4 && this.filtros.periodoSelecionado === 2 && this.filtros.mesSelecionado === 0) {
      this.toast.warning("Informe o mês.");
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }


    if (this.relatorioSelecionado === 5 && this.filtros.anoSelecionado === 0 ||
      this.relatorioSelecionado === 6 && this.filtros.anoSelecionado === 0 ||
      this.relatorioSelecionado === 7 && this.filtros.anoSelecionado === 0 ||
      this.relatorioSelecionado === 17 && this.filtros.anoSelecionado === 0) {
      this.toast.warning("Informe o ano.");
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }

    return true;
  }


  Imprimir(): void {
    this.serverApi.DownloadArquivo(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
      .subscribe(result => {
        this.serviceUtil.Imprimir(result, 'application/pdf')
      });
    this.imprimir = false;
  }

  BaixarArquivo() {
    this.serverApi.DownloadArquivo(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
      .subscribe(result => {
        this.serviceUtil.BaixarArquivo(result, 'application/pdf', '');
      }
      )
  };


}
