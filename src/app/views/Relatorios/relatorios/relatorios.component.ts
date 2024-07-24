import { getLocaleDateFormat } from '@angular/common';
import {
  OnInit,
  Component,
  HostListener,
  Injectable,
} from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Filtros } from 'src/app/models/Filtros';
import { RelatorioAnivCasamento, RelatorioIdosos, RelatorioMembrosAtivos, RelatorioPresenca } from 'src/app/models/relatorios';
import { AllservicesService } from 'src/app/services/allservices.service';
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
  meses:any[];
  anos:any[];
  relatorioSelecionado: number = 0;
  nomeRelatorio: string = "";

  filtros: Filtros = new Filtros();
  exibePeriodo = false;
  exibeMes = false;
  exibeAno = false
  exibePeriodoOutros = false;


  relatorioAniversario: RelatorioAnivCasamento[] = new Array();
  relatorioAniCasamento: RelatorioAnivCasamento[] = new Array();
  relatorioMembrosAtivos: RelatorioMembrosAtivos[] = new Array()
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

  totalAniversariantes: number = 0
  totalAniversariantesCasamento: number = 0

  constructor(private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>
  ) { }

  ngOnInit() {
    this.carregaCombos();
  }
  carregaCombos() {
    this.tipoRelatorio = this.serviceUtil.TipoRelatorio();
    this.periodo = this.serviceUtil.Periodo();
    this.meses = this.serviceUtil.MesesDoAno();
    this.meses = this.serviceUtil.MesesDoAno();
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
      case 6:
      case 7:
      case 17:
        this.anos = []
        this.CarregaComboAnos();
        this.exibeAno = true
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
    this.exibeMes = false;
    this.exibeAno = false;
    this.filtros.mesSelecionado = 0;
    this.imprimir = false;

  }

  public SelecionarPeriodo(): void {
    this.imprimir = false;
    this.exibeMes = this.filtros.periodoSelecionado > 1 ? true : false;
  }

  public SelecionaMes():void {
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
              element.janeiro = element.janeiro != null ? "done" : "highlight_off";
              element.fevereiro = element.fevereiro != null ? "done" : "highlight_off";
              element.marco = element.marco != null ? "done" : "highlight_off";
              element.abril = element.abril != null ? "done" : "highlight_off";
              element.maio = element.maio != null ? "done" : "highlight_off";
              element.junho = element.junho != null ? "done" : "highlight_off";
              element.julho = element.julho != null ? "done" : "highlight_off";
              element.agosto = element.agosto != null ? "done" : "highlight_off";
              element.setembro = element.setembro != null ? "done" : "highlight_off";
              element.outubro = element.outubro != null ? "done" : "highlight_off";
              element.novembro = element.novembro != null ? "done" : "highlight_off";
              element.dezembro = element.dezembro != null ? "done" : "highlight_off";

            });
          }
          switch (this.relatorioSelecionado) {
            case 1:
            case 2:
            case 17:
              this.relatorioMembrosAtivos = rel.data
              this.imprimir = true
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioMembrosAtivos.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break;
            case 3:
              this.relatorioIdosos = rel.data;
              this.imprimir = true
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioIdosos.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break;
            case 4:
              let response: RelatorioAnivCasamento[] = new Array()
              response = rel.data;
              this.relatorioAniversario = response.filter(x => x.tipoRelatorio == 4)
              this.relatorioAniCasamento = response.filter(x => x.tipoRelatorio == 8)
              this.totalAniversariantes = this.relatorioAniversario.length;
              this.totalAniversariantesCasamento = this.relatorioAniCasamento.length
              this.imprimir = true
              this.spinner = false
              this.mensagemDeretorno = this.relatorioAniversario.length === 0 && this.relatorioAniCasamento.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break;
            case 5:
              this.nomeRelatorio = "Relatório - Membros / Participação na Santa Ceia. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = true
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break

            case 6:
              this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião Local. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = true
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break
            case 7:
              this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião na Sede. "
              this.relatorioPresenca = trataCamposPresenca
              this.imprimir = true
              this.spinner = false;
              this.mensagemDeretorno = this.relatorioPresenca.length === 0 ? '' : 'Não foram encontrado resultados para essa Pesquisa.';
              break;
          }
        }, (err) => {
          this.serviceUtil.showMessage(`Erro ao extrair relatório : ${err.error.message}`, true);
          this.spinner = false
        });
    } catch (error) {
      this.spinner = false
    }
  }

  private ValidacoesRelatorio(): boolean {

    if (this.relatorioSelecionado === 0) {
      this.serviceUtil.showMessage("Selecione um relatório", true);
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }

    if (this.relatorioSelecionado === 4 && this.filtros.periodoSelecionado === 0 ) {
      this.serviceUtil.showMessage("Selecione o período.", true);
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }

    if (this.relatorioSelecionado === 4 && this.filtros.periodoSelecionado === 2 && this.filtros.mesSelecionado === 0) {
      this.serviceUtil.showMessage("Informe o mês.", true);
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }


    if (this.relatorioSelecionado === 5 && this.filtros.anoSelecionado === 0 || 
        this.relatorioSelecionado === 6 && this.filtros.anoSelecionado === 0 || 
        this.relatorioSelecionado === 7 && this.filtros.anoSelecionado === 0 || 
        this.relatorioSelecionado === 17 && this.filtros.anoSelecionado === 0) {
      this.serviceUtil.showMessage("Informe o ano.", true);
      this.LimparFiltros();
      this.relatorioSelecionado = 0;
      this.filtros.periodoSelecionado = 0;
      return false;
    }


    // case 5:
    //   case 6:
    //   case 7:
    //   case 17:


    return true;
  }


  Imprimir(): void {
    this.serverApi.DownloadArquivo(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
      .subscribe(result => {
        this.serviceUtil.Imprimir(result, 'application/pdf')
      });
  }

  BaixarArquivo() {
    this.serverApi.DownloadArquivo(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
      .subscribe(result => {
        this.serviceUtil.BaixarArquivo(result, 'application/pdf', '');
      }
      )
  };


}
