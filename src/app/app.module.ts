import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { HttpClientModule } from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

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
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'

import { BemVindoComponent } from './views/bem-vindo/bem-vindo.component';
import { ReadMembrosComponent } from './views/Membros/read-membros/read-membros.component';
import { DeleteMembroComponent } from './views/Membros/delete-membro/delete-membro.component';
import { UpdateMembroComponent } from './views/Membros/update-membro/update-membro.component';
import { CadastroMembrosComponent } from './views/Membros/cadastro-membros/cadastro-membros.component';
import { RelatoriosComponent } from './views/Relatorios/relatorios/relatorios.component';



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
    MatNativeDateModule

  ],
  providers: [AutenticacaoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
