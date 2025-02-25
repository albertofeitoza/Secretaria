import { Pessoa } from './../../models/pessoa';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Usuario } from 'src/app/models/Usuario';
import { contatos } from 'src/app/models/contato';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  usuarios: Usuario[] = new Array()


  cpf: any
  tipousuarios: any[]

  pessoa: Pessoa = new Pessoa()
  usuario: Usuario = new Usuario();
  contato: contatos = new contatos();

  instrucao: any[];
  sexo: any[];

  spinner: boolean = false;
  linhaSelecionada: number = 0
  bloquearCampos = false;
  Colunas = ['id', 'nomeUsuario', 'tipoUsuario', 'ativo', 'action']

  constructor(
    private matdialogRef: MatDialogRef<UsuariosComponent>,
    private utilService: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private auth: AutenticacaoService
  ) {

  }

  ngOnInit() {
    this.CarregarCombos()
    this.BuscaUsuarios()

  }

  CarregarCombos() {
    this.tipousuarios = this.utilService.TipoUsuario()
    this.instrucao = this.utilService.GrauInstrucao();
    this.sexo = this.utilService.Sexo();
  }

  Filtros(keyEvent: any) {

    if (keyEvent.which == 13 || keyEvent.which == 1) {

      if (this.cpf) {
        this.serverApi.readById(this.cpf, Endpoint.BuscaPorCpf, '', this.auth.dadosUsuario.IgrejaLogada).subscribe(res => {
          if (res.code == 200)
            this.pessoa = res.data;
          else
            this.utilService.showMessage("Cpf não cadastrado", true);
          this.cpf = ""
        })
      } else
        this.utilService.showMessage("Informe o cpf.", true);
    }
  }

  SalvarUsuario() {

    if (this.pessoa.id == 0) {

      this.pessoa.estadoCivil = 1;
      this.pessoa.statusPessoa = 0;
      this.contato.id = 0;
      this.contato.ddd = 11;
      this.usuario.ativo = true;

      this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', Number(this.matdialogRef.id)).subscribe(response => {
        if (response.code != 200) {
          this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
          this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
          this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
          this.pessoa.igrejaId = Number(this.matdialogRef.id)

          this.serverApi.create(this.pessoa, Endpoint.Pessoa)
            .subscribe(result => {
              this.pessoa = result
              this.contato.pessoaId = result.id
              this.CadastrarContato(result, true);
              this.CadastrarUsuario(result, true);
              this.BuscaUsuarios();
            });
        } else {

          if (response.data.igrejaId == Number(this.matdialogRef.id)) {

            this.CadastrarContato(response.data, true);
            this.CadastrarUsuario(response.data, true);
            this.BuscaUsuarios();

          } else {

            const igreja = response?.data?.nome?.split(';');
            this.utilService.showMessage(`Já existe cadastro para o CPF informado : ${this.pessoa.cpf} Nome: ${igreja[0]} ${igreja[1]}, solicite a transferência `, true)

          }

        }
      });
    }else {
      this.CadastrarUsuario(this.pessoa, true);
      this.BuscaUsuarios();
    }
  }

  private CadastrarContato(pessoa: any, acao: boolean): void {

    this.contato.pessoaId = pessoa.id;

    this.serverApi.create(this.contato, Endpoint.Contatos)
      .subscribe(() => { });
  }

  private CadastrarUsuario(dados: any, acao: boolean): void {

    this.usuario.pessoaId = dados.id;

    this.serverApi.create(this.usuario, Endpoint.Usuario)
      .subscribe(() => { });

  }

  public CadastrarNovoUsuario(): void {
    this.pessoa = new Pessoa();
    this.usuario = new Usuario();
    this.contato = new contatos();
    this.bloquearCampos = false;
    this.BuscaUsuarios();
  }


  private BuscaUsuarios(): void {
    if (Number(this.matdialogRef.id) > 0) {

      this.serverApi.read(Endpoint.Usuario + `/usuariosestabelecimento/${this.matdialogRef.id}`)
        .subscribe((result) => {
          result.forEach(x => {
            x.tipoUsuario = this.utilService.TipoUsuario().filter(u => u.id == x.tipoUsuario).map(v => v.value);
          })
          this.usuarios = result;
        })

    }
  }

  BuscarUsuarioPorId(id: any) {

    this.serverApi.readById(id, Endpoint.Usuario)
      .subscribe(res => {
        this.usuario = res.data
        this.pessoa = res.data.pessoa
        this.contato = res.data.pessoa.contatos[0];
      }
      )
    this.BloquearCampos();
  }

  LinhaSelecionada(id: any) {
    this.linhaSelecionada = id;
  }

  private BloquearCampos(): void {
    this.bloquearCampos = true;
  }

}
