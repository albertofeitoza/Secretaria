import { Component } from '@angular/core';
import { Pessoa } from 'src/app/models/pessoa';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-cadastro-membros',
  templateUrl: './cadastro-membros.component.html',
  styleUrls: ['./cadastro-membros.component.css']
})


export class CadastroMembrosComponent {


  step = 0;
  pessoa: Pessoa = new Pessoa();

  //combos
  estCivil : any[]
  instrucao : any[]
  statusPessoa : any[]
  sexo : any[]

  constructor(
    private serviceUtil : UtilServiceService) {}

  ngOnInit() {
    this.CarregarCombos()
    this.setStep(0)

  }

  CarregarCombos(){
    this.estCivil = this.serviceUtil.EstCivil();
    this.instrucao = this.serviceUtil.GrauInstrucao();
    this.statusPessoa = this.serviceUtil.StatusPessoa();
    this.sexo = this.serviceUtil.Sexo();
  }

  setStep(index: number) {
    this.step = index;
  }

  Proximo() {
    this.Salvar()
    this.step++;
  }

  Voltar() {
    this.step--;
  }

  Salvar() {
    this.serviceUtil.showMessage("Membro Cadastrado com sucesso!", true)
  }

}
