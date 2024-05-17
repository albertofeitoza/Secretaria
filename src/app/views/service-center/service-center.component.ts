import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { Endpoint } from 'src/app/enum/Endpoints';
import { ServiceCenter } from 'src/app/models/ServiceCenter';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Injectable()

@Component({
  selector: 'app-service-center',
  templateUrl: './service-center.component.html',
  styleUrls: ['./service-center.component.css']
})
export class ServiceCenterComponent implements OnInit {

  tipoUsuario: Number = 0;
  Colunas = ['id', 'nomeMembro', 'departamento', 'nomePendencia'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datasource = new MatTableDataSource<ServiceCenter>();

  constructor(
    private auth: AutenticacaoService,
    private serviceApi: AllservicesService<any>
  ) { }

  ngOnInit() {
    this.tipoUsuario = this.UsuarioLogado();
    this.BuscarPendencias();
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
  }

  private UsuarioLogado(): Number {
    return this.auth.tipoUsuarioLogado
  }

  BuscarPendencias(){
    this.serviceApi.read(Endpoint.ServiceCenter)
      .subscribe((result : ServiceCenter[]) => {
        result = result.sort()
        this.datasource.data = result
        this.datasource.sort = this.sort
      });
  }

}
