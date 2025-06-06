import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Endpoint } from 'src/app/enum/Endpoints';
import { AllservicesService } from 'src/app/services/allservices.service';
import { ViewFinanceiro } from '../Financeiro/model/viewFinanceiro';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// class FoodNode {
//   name: string;
//   children?: FoodNode[];
// }




export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  tUsuarioLogado = 0;
  width = "140px;"

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ValidaFaturas = false;

  showFiller = false;

  TREE_DATA: any[] = [
    {
      name: 'Serviços',
      children: [
        { name: 'Em Cert de batismo' }, 
        { name: 'Em Cert Pré Nupcial' }, 
        { name: 'Em Cert Apr Crianças' }
      ]
    }
    // ,
    // {
    //   name: 'Vegetables',
    //   children: [
    //     {
    //       name: 'Green',
    //       children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
    //     },
    //     {
    //       name: 'Orange',
    //       children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
    //     },
    //   ],
    // },
  ];

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();


  constructor(
    private auth: AutenticacaoService,
    private serviceApi: AllservicesService<any>
  ) {
    this.dataSource.data = this.TREE_DATA;
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.PermissaoMenus();
    this.ExibirMenuFaturas();
  }

  logoof() {
    this.auth.logoof()
  }

  private PermissaoMenus(): void {
    this.tUsuarioLogado = this.auth.dadosUsuario.TipoUsuarioLogado;
  }

  Menu() {

    let menu =
      this.width.includes("140px;") ?
        this.width = "57px;" :
        this.width.includes("57px;") ?
          this.width = "140px;" : this.width = this.width;
    return menu;
  }

  private ExibirMenuFaturas() {
    this.serviceApi.read(Endpoint.Financeiro + `/estabelecimento/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ViewFinanceiro[]) => {
        this.ValidaFaturas = result.length > 0 ? true : false;
      })
  }
}
