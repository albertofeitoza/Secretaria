import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { AppComponent } from './app.component';
import { BemVindoComponent } from './views/bem-vindo/bem-vindo.component';
import { ReadMembrosComponent } from './views/Membros/read-membros/read-membros.component';
import { RelatoriosComponent } from './views/Relatorios/relatorios/relatorios.component';

const routes: Routes = [
  {path : '', component: BemVindoComponent},
  {path: "home", component: HomeComponent },
  {path: "login", component: LoginComponent },
  {path: "membros", component: ReadMembrosComponent},
  {path: "relatorios", component: RelatoriosComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
