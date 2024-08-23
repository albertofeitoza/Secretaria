import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { BemVindoComponent } from './views/bem-vindo/bem-vindo.component';
import { ReadMembrosComponent } from './views/Membros/read-membros/read-membros.component';
import { RelatoriosComponent } from './views/Relatorios/relatorios/relatorios.component';
import { CadastroMembrosComponent } from './views/Membros/cadastro-membros/cadastro-membros.component';
import { UpdateMembroComponent } from './views/Membros/update-membro/update-membro.component';
import { OfertasComponent } from './views/ofertas/ofertas.component';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { FilhosComponent } from './views/Membros/Modal/filhos/filhos.component';
import { FilhosMembrosComponent } from './views/filhos-membros/filhos-membros.component';
import { IgrejaComponent } from './views/igreja/igreja.component';

const routes: Routes = [
  {path : '', component: BemVindoComponent},
  {path: "home", component: HomeComponent },
  {path: "login", component: LoginComponent },
  {path: "membros", component: ReadMembrosComponent},
  {path: "membros/:nome", component: ReadMembrosComponent},
  {path: "membrosadd", component: CadastroMembrosComponent},
  {path: "membrosupdate/:id", component: UpdateMembroComponent},
  {path: "relatorios", component: RelatoriosComponent},
  {path: "ofertas", component: OfertasComponent},
  {path: "usuarios", component: UsuariosComponent},
  {path: "igreja", component: IgrejaComponent},
  {path: "filhos", component: FilhosMembrosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
