import { Component, OnInit } from '@angular/core';
import { AssinaturaDto } from '../../model/viewAssinaturas';
import { Endpoint } from 'src/app/enum/Endpoints';
import { AllservicesService } from 'src/app/services/allservices.service';
import { ViewIgreja } from 'src/app/models/Igreja';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { ToastrService } from 'ngx-toastr';

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
    private serviceApi: AllservicesService<any>,
    private utilService: UtilServiceService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.idAssinatura = Number(this.matdialogRef._containerInstance._config.data.dadosTela);
    this.CarregaCombos();
    this.BuscarAssinatura();
  }

  public Salvar(): void {

    if (!this.utilService.ValidaCpf(this.assinatura.cpf.toString())) {
      this.toast.warning("Cpf Inválido")
      return
    }


    this.assinatura.cpf = this.assinatura.cpf.toString().replace(/\D/g, '');
    this.assinatura.cpf = ("00000000000" + this.assinatura.cpf.toString()).slice(-11);
    this.assinatura.telefone = this.assinatura.telefone.toString();

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
