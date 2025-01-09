import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
//Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

//Services
import { AutenticacaoService } from './services/autenticacao.service';

//Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'

//configurar a app para português
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { BemVindoComponent } from './views/bem-vindo/bem-vindo.component';
import { ReadMembrosComponent } from './views/Membros/read-membros/read-membros.component';
import { DeleteMembroComponent } from './views/Membros/delete-membro/delete-membro.component';
import { UpdateMembroComponent } from './views/Membros/update-membro/update-membro.component';
import { CadastroMembrosComponent } from './views/Membros/cadastro-membros/cadastro-membros.component';
import { RelatoriosComponent } from './views/Relatorios/relatorios/relatorios.component';
import { PopupConfirmacaoComponent } from './popups/popup-confirmacao/popup-confirmacao.component';
import { OfertasComponent } from './views/ofertas/ofertas.component';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PopupcomponetComponent } from './popups/popupcomponet/popupcomponet.component';
import { HistoricoPopupComponent } from './views/Membros/historico-popup/historico-popup.component';
import { CartarecomendacaoComponent } from './views/Membros/cartarecomendacao/cartarecomendacao.component';
import { ControlePresencaComponent } from './views/Membros/Modal/controle-presenca/controle-presenca.component';
import { HistoricoMembroComponent } from './views/Membros/Modal/historico-membro/historico-membro.component';
import { ServiceCenterComponent } from './views/service-center/service-center.component';
import { FilhosComponent } from './views/Membros/Modal/filhos/filhos.component';
import { FilhosMembrosComponent } from './views/filhos-membros/filhos-membros.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { UnirCadastroComponent } from './views/Membros/Modal/unir-cadastro/unir-cadastro.component';
import { PendenciasComponent } from './views/service-center/modal/pendencias/pendencias.component';
import { PessoasporfuncaoComponent } from './views/service-center/modal/pessoasporfuncao/pessoasporfuncao.component';
import { IgrejaComponent } from './views/igreja/igreja.component';
import { AdicionarIgrejaComponent } from './views/igreja/modal/adicionar-igreja/adicionar-igreja.component';
import { PastoresComponent } from './views/igreja/modal/pastores/pastores.component';
import { OrganogramaComponent } from './views/organograma/organograma.component';
import { ModalSelecionaLiderComponent } from './views/filhos-membros/modal/modal-seleciona-lider/modal-seleciona-lider.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BemVindoComponent,
    ReadMembrosComponent,
    DeleteMembroComponent,
    UpdateMembroComponent,
    CadastroMembrosComponent,
    RelatoriosComponent,
    PopupConfirmacaoComponent,
    OfertasComponent,
    UsuariosComponent,
    PopupcomponetComponent,
    HistoricoPopupComponent,
    CartarecomendacaoComponent,
    ControlePresencaComponent,
    HistoricoMembroComponent,
    ServiceCenterComponent,
    FilhosComponent,
    FilhosMembrosComponent,
    UnirCadastroComponent,
    PendenciasComponent,
    PessoasporfuncaoComponent,
    IgrejaComponent,
    AdicionarIgrejaComponent,
    PastoresComponent,
    OrganogramaComponent,
    ModalSelecionaLiderComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    NgxPrintModule,
    HttpClientModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSortModule

  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
   [AutenticacaoService]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
