import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  tUsuarioLogado = 0;
  width = "200px;"

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private auth: AutenticacaoService) { }

  ngOnInit() {
    this.PermissaoMenus()
  }

  logoof() {
    this.auth.logoof()
  }

  private PermissaoMenus(): void {
    this.tUsuarioLogado = this.auth.dadosUsuario.TipoUsuarioLogado;
  }

  Menu() {

    let menu =
      this.width.includes("200px;") ?
        this.width = "57px;" :
        this.width.includes("57px;") ?
          this.width = "200px;" : this.width = "200px;"
    return menu;
  }
}
