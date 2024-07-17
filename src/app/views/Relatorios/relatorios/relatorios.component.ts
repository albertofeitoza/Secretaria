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
  templateUrl: './relatorios.component.html'
})

@Injectable({
  providedIn: 'root'
})

export class RelatoriosComponent implements OnInit {

  TituloRelatorio: string = "Relatórios"
  imprimir: boolean = false
  tipoRelatorio: any[]
  relatorioSelecionado: number = 0;
  nomeRelatorio: string = "";

  exibePeriodo = false;
  dataInicio = '';
  dataFim = '';

  relatorioAniversario: RelatorioAnivCasamento[] = new Array();
  relatorioAniCasamento: RelatorioAnivCasamento[] = new Array();
  relatorioMembrosAtivos: RelatorioMembrosAtivos[] = new Array()
  relatorioIdosos: RelatorioIdosos[] = new Array()
  relatorioPresenca: RelatorioPresenca[] = new Array()
  spinner: boolean = false

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
    this.tipoRelatorio = this.serviceUtil.TipoRelatorio()
  }

  @HostListener("window:beforeprint", ["$event"])
  onBeforePrint() {
    console.log("onBeforePrint");
  }


  public RelatorioSelecionado(): void {
    this.BuscarRelatorio();
  }

  private BuscarRelatorio(): void {
    this.imprimir = false;

    if (this.relatorioSelecionado > 0)
      this.spinner = true;

    let filtros: Filtros = new Filtros()
    filtros.dataInicial = this.dataInicio;
    filtros.dataFinal = this.dataFim;

    let filtro = JSON.stringify(filtros)

    this.serverApi.readById(this.relatorioSelecionado.toString(), Endpoint.Relatorios, filtro)
      .subscribe(rel => {

        let trataCamposPresenca: RelatorioPresenca[] = new Array()
        
        if (this.relatorioSelecionado === 5 || this.relatorioSelecionado === 6 || this.relatorioSelecionado === 7) {

          trataCamposPresenca = rel

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
            break;
          case 3:
            this.relatorioIdosos = rel
            this.imprimir = true
            this.spinner = false;
            break;
          case 4:
            let response: RelatorioAnivCasamento[] = new Array()
            response = rel;
            this.relatorioAniversario = response.filter(x => x.tipoRelatorio == 4)
            this.relatorioAniCasamento = response.filter(x => x.tipoRelatorio == 8)
            this.totalAniversariantes = this.relatorioAniversario.length;
            this.totalAniversariantesCasamento = this.relatorioAniCasamento.length
            this.imprimir = true
            this.spinner = false
            break;
          case 5:
            this.nomeRelatorio = "Relatório - Membros / Participação na Santa Ceia. "
            this.relatorioPresenca = trataCamposPresenca
            this.imprimir = true
            this.spinner = false;
            break

          case 6:
            this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião Local. "
            this.relatorioPresenca = trataCamposPresenca
            this.imprimir = true
            this.spinner = false;
            break
          case 7:
            this.nomeRelatorio = "Relatório - Obreiros / Participação de Reunião na Sede. "
            this.relatorioPresenca = trataCamposPresenca
            this.imprimir = true
            this.spinner = false;
            break;
        }
      }, (err) => {
        this.serviceUtil.showMessage(`Erro ao extrair relatório : ${err.error.message}`, true);
      });

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
