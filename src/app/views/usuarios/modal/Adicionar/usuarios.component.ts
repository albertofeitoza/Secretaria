import { Pessoa, ViewPessoa } from '../../../../models/pessoa';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Usuario } from 'src/app/models/Usuario';
import { contatos } from 'src/app/models/contato';
import { AllservicesService } from 'src/app/services/allservices.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = new Array()
  pessoas: ViewPessoa[] = new Array();

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
  igrejaSelecionada = 0;
  pessoaSelecionada = true;

  constructor(
    private matdialogRef: MatDialogRef<UsuariosComponent>,
    private utilService: UtilServiceService,
    private serverApi: AllservicesService<any>,
    private toast: ToastrService
  ) {

  }

  ngOnInit() {
    this.igrejaSelecionada = this.matdialogRef._containerInstance._config.data.dadosTela;
    this.BuscarPessoas();
    this.CarregarCombos();
  }

  CarregarCombos() {
    this.tipousuarios = this.utilService.TipoUsuario()
    this.instrucao = this.utilService.GrauInstrucao();
    this.sexo = this.utilService.Sexo();
  }
  private BuscarPessoas() {
    this.serverApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.igrejaSelecionada}`)
      .subscribe((result: ViewPessoa[]) => {
        this.pessoas = result.filter(f => f.statusPessoa != "Inativo" && f.statusPessoa != "ExcluidoDoSistema");
      });
  }


  SalvarPessoa() {

    if (this.pessoa.id === 0) {

      this.pessoa.estadoCivil = 1;
      this.pessoa.statusPessoa = 0;
      // this.contato.id = 0;
      // this.contato.ddd = 11;
      this.usuario.ativo = true;

      this.pessoa.cpf = this.pessoa.cpf.replace(/\D/g, '');
      this.pessoa.cpf = ("00000000000" + this.pessoa.cpf).slice(-11);

      if(this.pessoas.filter(p => p.cpf === this.pessoa.cpf).length > 0){
        this.toast.warning(`Esse cpf já possui cadastro, selecione no combo box pessoa : ${this.pessoas.filter(p => p.cpf === this.pessoa.cpf)[0].nome}`)
        this.pessoaSelecionada = false;
        return 
      }
        
      this.serverApi.readById(this.pessoa.cpf, Endpoint.BuscaPorCpf, '', Number(this.igrejaSelecionada))
        .subscribe(response => {
          if (response.code != 200) {
            this.pessoa.cpf = this.pessoa.cpf != undefined ? this.pessoa.cpf.toString() : this.pessoa.cpf
            this.pessoa.rg = this.pessoa.rg != undefined ? this.pessoa.rg.toString() : this.pessoa.rg
            this.pessoa.dataCasamento = this.pessoa.estadoCivil == 1 || this.pessoa.estadoCivil > 4 ? undefined : this.pessoa.dataCasamento
            this.pessoa.igrejaId = Number(this.igrejaSelecionada)

            this.serverApi.create(this.pessoa, Endpoint.Pessoa)
              .subscribe(result => {
                this.pessoa = result
                this.contato.pessoaId = result.id
                // this.CadastrarContato(result);
                this.BuscarPessoas();
                this.pessoaSelecionada = false;
              });
          } else {

            const igreja = response?.data?.nome?.split(';');
            this.toast.warning(`Já existe cadastro para o CPF informado : ${this.pessoa.cpf} Nome: ${igreja[0]} ${igreja[1]}, solicite a transferência `)

          }
        });
    }
  }


  private CadastrarContato(pessoa: any): void {

    this.contato.pessoaId = pessoa.id;

    this.serverApi.create(this.contato, Endpoint.Contatos)
      .subscribe(() => { });
  }

  public CadastrarUsuario(): void {

    this.usuario.pessoaId = this.pessoa.id;
    this.usuario.primeiroAcesso = this.usuario.senha ? true : false;
    this.serverApi.create(this.usuario, Endpoint.Usuario)
      .subscribe(() => {
        this.toast.success(`${this.usuario.id == 0 ? 'Usuário Cadastrado!' : 'Dados Alterados com sucesso'} `)
        this.matdialogRef.close();
      });

  }

  public CadastrarNovaPessoa(): void {
    this.pessoa = new Pessoa();
    this.pessoaSelecionada = false;
  }


  LinhaSelecionada(id: any) {
    this.linhaSelecionada = id;
  }

  private BloquearCampos(): void {
    this.bloquearCampos = true;
  }

}
