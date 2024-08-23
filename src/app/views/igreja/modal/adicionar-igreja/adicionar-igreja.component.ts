import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    private matdialogRef: MatDialogRef<AdicionarIgrejaComponent>,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService
  ) { }

  ngOnInit(): void {
    this.BuscarIgreja();
  }


  public AdicionarIgreja(): void {

    if (this.igreja.cnpj.length <= 11) {

      if (this.serviceUtil.ValidaCpf(this.igreja.cnpj)) {
        this.serviceApi.create(this.igreja, Endpoint.Igreja).subscribe(() => {

          if (this.igreja.id > 0)
            this.serviceUtil.showMessage("Dados Alterados com sucesso!")
          else
            this.serviceUtil.showMessage("Igreja cadastrada com sucesso!")

          this.matdialogRef.close();
        });
      }

    } else {

      if (this.serviceUtil.ValidaCNPJ(this.igreja.cnpj)) {
        this.serviceApi.create(this.igreja, Endpoint.Igreja).subscribe(() => {

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

  private BuscarIgreja(): void {
    if (Number(this.matdialogRef.id) > 0)
      this.serviceApi.readById(this.matdialogRef.id.toString(), Endpoint.Igreja)
        .subscribe((result) => {
          this.igreja = result.data;
        })
  }

}
