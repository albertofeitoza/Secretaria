import { Component, OnInit } from '@angular/core';
import { AssinaturaDto } from '../../model/viewAssinaturas';
import { Endpoint } from 'src/app/enum/Endpoints';
import { AllservicesService } from 'src/app/services/allservices.service';
import { igreja, ViewIgreja } from 'src/app/models/Igreja';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assinatura-adicionar',
  templateUrl: './assinatura-adicionar.component.html',
  styleUrls: ['./assinatura-adicionar.component.css']
})
export class AssinaturaAdicionarComponent implements OnInit {
  igrejas: ViewIgreja[] = new Array();
  assinatura: AssinaturaDto = new AssinaturaDto();
  idAssinatura = 0;

  constructor(
    private matdialogRef: MatDialogRef<AssinaturaAdicionarComponent>,
    private serviceApi: AllservicesService<any>
  ) { }

  ngOnInit(): void {
    this.idAssinatura = Number(this.matdialogRef._containerInstance._config.data.dadosTela);
    this.CarregaCombos();
    this.BuscarAssinatura();
  }

  public Salvar(): void {
    this.serviceApi.create(this.assinatura, Endpoint.Assinaturas)
        .subscribe((result: AssinaturaDto) => {
          this.assinatura = result;
          this.matdialogRef.close();
        })
  }

  private CarregaCombos(): void {
    this.serviceApi.read(Endpoint.Igreja + `/estabelecimento/0`)
      .subscribe((result: ViewIgreja[]) => {
        this.igrejas = result;
      })
  }

  private BuscarAssinatura(): void {
    if (this.idAssinatura > 0) {
      this.serviceApi.readById(this.idAssinatura.toString(), Endpoint.Assinaturas)
        .subscribe((result: AssinaturaDto) => {
          this.assinatura = result;
        })
    }
  }

}
