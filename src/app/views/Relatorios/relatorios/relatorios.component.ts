import {
  OnInit,
  Component,
  HostListener,
  Injectable,
} from '@angular/core';
import { Endpoint } from 'src/app/enum/Endpoints';
import { RelatorioAnivCasamento, RelatorioCeia, RelatorioIdosos, RelatorioMembrosAtivos } from 'src/app/models/relatorios';
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
  imprimir : boolean = false
  tipoRelatorio: any[]
  relatorioSelecionado: number = 0;

  relatorioAniversario: RelatorioAnivCasamento[] = new Array();
  relatorioAniCasamento: RelatorioAnivCasamento[] = new Array();
  relatorioMembrosAtivos: RelatorioMembrosAtivos[] = new Array()
  relatorioIdosos: RelatorioIdosos[] = new Array()
  relatorioCeia : RelatorioCeia[] = new Array()
  Colunas = ['nome', 'dataNascimento']
  ColunasGridCasamento = ['nome', 'nomeConjuge', 'dataCasamento', 'quantidadeAnosCasado']
  ColunasGridMembrosAtivos = ['nome', 'rol', 'congregacao', 'validadeCartaoMembro']
  ColunasGridRelatorioIdosos = ['nome', 'endereco', 'ultimaSantaCeia']
  ColunasGridRelatorioCeia = ['nome', 'janeiro', 'fevereiro', 'marco'
              ,'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 'participacao' ]

  nome: string
    janeiro: string
    fevereiro: string
    marco: string
    abril: string
    maio: string
    junho: string
    julho: string
    agosto: string
    setembro: string
    outubro: string
    novembro: string
    dezembro: string
    participacao : string






  totalAniversariantes: number = 0
  totalAniversariantesCasamento: number = 0

  constructor(private serviceUtil: UtilServiceService,
    private serverApi: AllservicesService<any>,
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

  RelatorioSelecionado() {
    this.imprimir = false;
    this.serverApi.readById(this.relatorioSelecionado.toString(), Endpoint.Relatorios)
      .subscribe(rel => {
        
        switch (this.relatorioSelecionado) {
          case 1:
          case 2:
            this.relatorioMembrosAtivos = rel
            this.imprimir = true
            break;
          case 3:
            this.relatorioIdosos = rel
            this.imprimir = true
            break;
          case 4:
            let response: RelatorioAnivCasamento[] = new Array()
            response = rel;
            this.relatorioAniversario = response.filter(x => x.tipoRelatorio == 4)
            this.relatorioAniCasamento = response.filter(x => x.tipoRelatorio == 8)
            this.totalAniversariantes = this.relatorioAniversario.length;
            this.totalAniversariantesCasamento = this.relatorioAniCasamento.length
            this.imprimir = true
            break;
          case 5:
            this.relatorioCeia = rel
            this.imprimir = true
          break
          default:
            break;
        }

      })
  }

  Imprimir(): void {
    this.serverApi.DownloadArquivoPdf(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
    .subscribe(result => {
        const blob = new Blob([result], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(blob);

        let iframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.src = fileURL;
        iframe.onload = function () {
          setTimeout(function () {
            iframe.focus();
            iframe.contentWindow?.print();
          }, 1);
        };
      });
  }

  BaixarArquivo() {
    this.serverApi.DownloadArquivoPdf(this.relatorioSelecionado.toString(), Endpoint.DownloadArquivo)
      .subscribe(result => {

        const blob = new Blob([result], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = fileURL;
        a.download = blob.text.name;
        a.click();
      }
      )
  };


}
