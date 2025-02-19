import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError } from 'rxjs';
import { Endpoint } from 'src/app/enum/Endpoints';
import { igreja } from 'src/app/models/Igreja';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-adicionar-igreja',
  templateUrl: './adicionar-igreja.component.html',
  styleUrls: ['./adicionar-igreja.component.css']
})
export class AdicionarIgrejaComponent implements OnInit {

  igreja: igreja = new igreja();
  listaIgrejas: igreja[] = new Array();
  tipoIgreja: any[] = new Array();
  //tipoIgrejaEscolhida = 0;

  constructor(
    private matdialogRef: MatDialogRef<AdicionarIgrejaComponent>,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private servico: UtilServiceService
  ) { }

  ngOnInit(): void {
    this.igreja.id = 0;
    this.BuscarIgrejaPorId();
    this.CarregarCombo();
  }


  public AdicionarIgreja(): void {

    if (this.listaIgrejas.length > 0 && this.igreja.igrejaMae === 0)
      return this.serviceUtil.showMessage("Informe a igreja mãe!")

    if (this.igreja.cnpj.length <= 11) {

      if (this.serviceUtil.ValidaCpf(this.igreja.cnpj)) {

        this.serviceApi.create(this.igreja, Endpoint.Igreja)

          .subscribe(() => {

            if (this.igreja.id > 0)
              this.serviceUtil.showMessage("Dados Alterados com sucesso!")
            else
              this.serviceUtil.showMessage("Igreja cadastrada com sucesso!")

            this.matdialogRef.close();
          });
      }

    } else {

      if (this.serviceUtil.ValidaCNPJ(this.igreja.cnpj)) {

        this.serviceApi.create(this.igreja, Endpoint.Igreja)
          .subscribe(() => {

            if (this.igreja.id > 0)
              this.serviceUtil.showMessage("Dados Alterados com sucesso!")
            else
              this.serviceUtil.showMessage("Igreja cadastrada com sucesso!")

            this.matdialogRef.close();
          });
        
      }
    }
  }



  public EditarIgreja(id: number): void {
    this.serviceApi.readById(id.toString(), Endpoint.Igreja)
      .subscribe((result) => {
        this.igreja = result.data;

      }, err => {
        this.serviceUtil.showMessage(`Erro ao buscar os dados da Igreja ${err.error.message}';
      } `)
      });
  }

  private BuscarIgrejaPorId(): void {
    if (Number(this.matdialogRef.id) > 0)
      this.serviceApi.readById(this.matdialogRef.id.toString(), Endpoint.Igreja)
        .subscribe((result) => {
          
          this.igreja = result.data;

          if (this.igreja.tipoIgreja == 1)
            this.BuscarIgrejas()

        })
  }

  private CarregarCombo(): void {
    this.tipoIgreja = this.servico.TipoIgreja();

  }

  public BuscarIgrejas(): void {

    if (this.igreja.tipoIgreja > 1) {
      this.serviceApi.read(Endpoint.Igreja + `/estabelecimento/${this.igreja.id}`)
        .subscribe((result: igreja[]) => {
          this.listaIgrejas = result
        })
    }
  }

  FecharPopup() {
    this.matdialogRef.close();
  }
}
