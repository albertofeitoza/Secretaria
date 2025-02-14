import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { ViewPessoa } from 'src/app/models/pessoa';
import { ServiceCenter } from 'src/app/models/ServiceCenter';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { PendenciasComponent } from './modal/pendencias/pendencias.component';
import { PessoasporfuncaoComponent } from './modal/pessoasporfuncao/pessoasporfuncao.component';
import { TodasAsIgrejas } from 'src/app/models/Igreja';

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

  constructor(
    private auth: AutenticacaoService,
    private serviceApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService
  ) { }

  ngOnInit() {
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
    this.auth.dadosUsuario.IgrejaSelecionada = this.auth.dadosUsuario.IgrejaLogada;
    this.BuscarMembros();
    this.BuscarPendencias();
  }


  private BuscarMembros(): void {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ViewPessoa[]) => {
        this.pessoas = result;
        this.funcoes = new Set(result.map(x => x.funcao).sort());
        this.totalGeralMembros = result.filter(x => x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro").length;
      });
  }

  private BuscarPendencias(): void {
    this.serviceApi.read(Endpoint.ServiceCenter + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ServiceCenter[]) => {

        this.departamentos = new Set(result.map(x => x.departamento).sort());
        this.servicecenter = result;
      });
  }

  public QuantPendencias(departamento: any): number {
    return this.servicecenter.filter(x => x.departamento.includes(departamento)).length;
  }

  public ExibirPependencia(departamento: any): void {
    const dados = this.servicecenter.filter(x => x.departamento.includes(departamento));
    if (dados)
      this.serviceUtil.Popup(departamento, TipoPopup.ComponenteInstancia, PendenciasComponent, 0, 'auto', 'auto', false, false, dados)
  }

  public ExibirPessoas(funcao: string): void {
    const dados = this.pessoas.filter(x => x.funcao.includes(funcao) && x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro");
    if (dados)
      this.serviceUtil.Popup(funcao, TipoPopup.ComponenteInstancia, PessoasporfuncaoComponent, 0, 'auto', 'auto', false, false, dados)

  }

  public QuantPessoas(funcao: any): number {
    return this.pessoas.filter(x => x.funcao.includes(funcao) && x.statusPessoa != 'Inativo' && x.statusPessoa != "PreCadastro").length;
  }
}
